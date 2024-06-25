# // Certificate for the ALB
# resource "aws_acm_certificate" "self_signed" {
#   private_key      = file("C:/Users/trand/Desktop/sourcy-be/sourcy-infras/sourcy.key")
#   certificate_body = file("C:/Users/trand/Desktop/sourcy-be/sourcy-infras/sourcy.crt")
# }


# resource "aws_lb_listener" "https" {
#   load_balancer_arn = aws_alb.main_alb.arn
#   port              = "443"
#   protocol          = "HTTPS"
#   ssl_policy        = "ELBSecurityPolicy-2016-08"
#   certificate_arn   = aws_acm_certificate.self_signed.arn

#   default_action {
#     type             = "forward"
#     target_group_arn = aws_lb_target_group.app_tg.arn
#   }
# }
