resource "aws_db_instance" "postgres_db" {
  allocated_storage   = 20
  engine              = "postgres"
  engine_version      = "15.7"
  instance_class      = var.db_instance_class
  db_name             = var.db_name
  username            = var.db_user
  password            = var.db_password
  skip_final_snapshot = true
  publicly_accessible = true

  tags = {
    Name = "postgres-db"
  }
}
