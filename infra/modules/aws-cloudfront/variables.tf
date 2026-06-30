variable "bucket_id" {
  description = "S3 bucket ID/name to serve as the origin"
  type        = string
}

variable "bucket_arn" {
  description = "ARN of the S3 bucket, needed for the bucket policy"
  type        = string
}

variable "bucket_regional_domain_name" {
  description = "Regional domain name of the S3 bucket"
  type        = string
}

variable "price_class" {
  description = "CloudFront price class (controls which edge locations are used)"
  type        = string
  default     = "PriceClass_All"
}

variable "default_root_object" {
  description = "Default object served at the root URL"
  type        = string
  default     = "index.html"
}