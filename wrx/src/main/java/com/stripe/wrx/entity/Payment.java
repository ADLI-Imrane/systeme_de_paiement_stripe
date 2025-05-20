package com.stripe.wrx.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long amount;
    private String status;
    private String currency;
    private String productName;
    private Long quantity;
    @Column(length = 512)
    private String sessionId;
    @Column(length = 1024)
    private String stripeUrl;
    private LocalDateTime createdAt;
}
