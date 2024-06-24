// output alb dns name
output "alb_dns_name" {
  value = aws_alb.main_alb.dns_name
}


// output rds endpoint
output "db_instance_endpoint" {
  value = aws_db_instance.postgres_db.endpoint
}


