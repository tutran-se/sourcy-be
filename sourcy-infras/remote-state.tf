

terraform {
  backend "s3" {
    bucket         = "ap-southeast-1-remote-terraform-state-bucket"
    key            = "sourcy-infras/terraform.tfstate"
    region         = "ap-southeast-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
