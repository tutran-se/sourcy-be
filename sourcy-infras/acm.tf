

// Certificate for the ALB
resource "aws_acm_certificate" "self_signed" {
  private_key      = file("C:/Users/trand/Desktop/sourcy-be/sourcy-infras/sourcy.key")
  certificate_body = file("C:/Users/trand/Desktop/sourcy-be/sourcy-infras/sourcy.crt")
}

// Certificate for the ALB
resource "aws_acm_certificate" "acm_cert" {
  domain_name       = "hanhtrinhfullstack.com"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}


resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.acm_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }

  zone_id = "Z0808559MO0IGNO3BNF8" # Replace with your Route53 Hosted Zone ID
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "cert_validation" {
  certificate_arn         = aws_acm_certificate.acm_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}


resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_alb.main_alb.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = aws_acm_certificate.acm_cert.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app_tg.arn
  }
}
