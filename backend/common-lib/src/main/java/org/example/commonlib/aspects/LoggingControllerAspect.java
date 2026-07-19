package org.example.commonlib.aspects;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.example.commonlib.aspects.annotations.LoggingController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingControllerAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingControllerAspect.class);

    // Pointcut declarations: regex matches joinpoints
    @Pointcut("@annotation(org.example.commonlib.aspects.annotations.LoggingController)")
    public void loggingControllerPointcut() {}
    

    // Advice (Before,  AfterReturning, AfterThrowing, After(Finally), Around)

    @Before("loggingControllerPointcut()")
    public void logBefore(JoinPoint joinPoint) {
        logger.info("Entering method: {} with input paramaters {}", joinPoint.getSignature().getName(), joinPoint.getArgs());
    }

    @AfterReturning
    (pointcut = "loggingControllerPointcut()", returning = "result")
    public void logAfter(JoinPoint joinPoint, Object result)
    {
        logger.info("Exiting method: {} with result {}", joinPoint.getSignature().getName(), result);
    }

    @AfterThrowing
    (pointcut = "loggingControllerPointcut()", throwing = "exception")
    public void logAfterThrowing(JoinPoint joinPoint,  Exception exception)
    {
        logger.error("An exception was thrown in method: {} with message {}", joinPoint.getSignature().getName(), exception.getMessage());
    }

    
}
