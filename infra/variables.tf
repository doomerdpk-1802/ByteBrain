variable "bucket_name" {
  description = "Name of the S3 bucket"
  type        = string
}

variable "instance_name" {
  description = "Name for the EC2 instance"
  type        = string
}

variable "ami_id" {
  description = "AMI ID to launch"
  type        = string
  default     = null
}


variable "key_name" {
  description = "EC2 key pair name for SSH access (optional if using SSM)"
  type        = string
  default     = null
}

variable "tags" {
  description = "Additional tags"
  type        = map(string)
  default     = {}
}