package com.stripe.wrx.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.wrx.dto.ProductRequest;
import com.stripe.wrx.dto.StripeResponse;
import com.stripe.wrx.entity.Payment;
import com.stripe.wrx.repository.PaymentRepository;

@Service
public class StripeService {

    @Value("${stripe.secretKey}")
    private String secretKey;

    @Autowired
    private PaymentRepository paymentRepository;

    //stripe -API
    //-> productName , amount , quantity , currency
    //-> return sessionId and url

    public StripeResponse checkoutProducts(ProductRequest productRequest) {
        // Set your secret key. Remember to switch to your live secret key in production!
        Stripe.apiKey = secretKey;

        // Create a PaymentIntent with the order amount and currency
        SessionCreateParams.LineItem.PriceData.ProductData productData =
                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                        .setName(productRequest.getName())
                        .build();

        // Create new line item with the above product data and associated price
        SessionCreateParams.LineItem.PriceData priceData =
                SessionCreateParams.LineItem.PriceData.builder()
                        .setCurrency(productRequest.getCurrency() != null ? productRequest.getCurrency() : "USD")
                        .setUnitAmount(productRequest.getAmount())
                        .setProductData(productData)
                        .build();

        // Create new line item with the above price data
        SessionCreateParams.LineItem lineItem =
                SessionCreateParams
                        .LineItem.builder()
                        .setQuantity(productRequest.getQuantity())
                        .setPriceData(priceData)
                        .build();

        // Create new session with the line items
        SessionCreateParams params =
                SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.PAYMENT)
                        .setSuccessUrl("http://localhost:8080/success")
                        .setCancelUrl("http://localhost:8080/cancel")
                        .addLineItem(lineItem)
                        .build();

        // Create new session
        Session session;
        try {
            session = Session.create(params);
        } catch (StripeException e) {
            //log the error
            return StripeResponse
                    .builder()
                    .status("FAILURE")
                    .message("Failed to create payment session: " + e.getMessage())
                    .sessionId(null)
                    .sessionUrl(null)
                    .build();
        }

        if (session == null) {
            return StripeResponse
                    .builder()
                    .status("FAILURE")
                    .message("Failed to create payment session: session is null")
                    .sessionId(null)
                    .sessionUrl(null)
                    .build();
        }

        // Persist payment details in the database
        Payment payment = new Payment();
        payment.setSessionId(session.getId());
        payment.setStatus("CREATED");
        payment.setAmount(productRequest.getAmount());
        payment.setCurrency(productRequest.getCurrency());
        payment.setProductName(productRequest.getName());
        payment.setQuantity(productRequest.getQuantity());
        payment.setStripeUrl(session.getUrl());
        payment.setCreatedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        return StripeResponse
                .builder()
                .status("SUCCESS")
                .message("Payment session created ")
                .sessionId(session.getId())
                .sessionUrl(session.getUrl())
                .build();
    }

}
