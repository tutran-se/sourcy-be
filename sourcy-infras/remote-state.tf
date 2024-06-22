# Define the S3 bucket
resource "aws_s3_bucket" "terraform_state" {
  bucket = "remote-terraform-state-bucket"
}

# Define the DynamoDB table for state locking
resource "aws_dynamodb_table" "terraform_locks" {
  name         = "terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}


terraform {
  backend "s3" {
    bucket         = "remote-terraform-state-bucket"
    key            = "sourcy-infras/terraform.tfstate"
    region         = "ap-southeast-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
