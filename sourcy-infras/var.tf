variable "docker_image" {
  default = "tutran0806/sourcy-api:v2"
}


variable "db_name" {
  description = "The name of the database"
  type        = string
  default     = "mydb"
}

variable "db_user" {
  description = "The username for the database"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "The password for the database user"
  type        = string
  default     = "yourpassword"
}


variable "db_instance_class" {
  description = "The instance type of RDS instance"
  type        = string
  default     = "db.t3.micro"
}

