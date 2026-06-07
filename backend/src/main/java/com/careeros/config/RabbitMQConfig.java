package com.careeros.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String QUEUE_RESUME_PARSE = "resume-parsing-queue";
    public static final String QUEUE_INTERVIEW_EVAL = "interview-evaluation-queue";
    public static final String QUEUE_DSA_ROADMAP = "dsa-roadmap-queue";

    @Bean
    public Queue resumeParsingQueue() {
        // durable = true, exclusive = false, autoDelete = false
        return new Queue(QUEUE_RESUME_PARSE, true, false, false);
    }

    @Bean
    public Queue interviewEvaluationQueue() {
        return new Queue(QUEUE_INTERVIEW_EVAL, true, false, false);
    }

    @Bean
    public Queue dsaRoadmapQueue() {
        return new Queue(QUEUE_DSA_ROADMAP, true, false, false);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
