terraform {
  backend "s3" {
    bucket       = "terraform-states-0408"
    key          = "bytebrain.tfstate"
    region       = "eu-north-1"
    use_lockfile = true
    encrypt      = true
  }
}