output "bucket_id" {
  description = "The name of the bucket"
  value       = aws_s3_bucket.bb_bucket.id
}

output "bucket_arn" {
  description = "The ARN of the bucket, needed for IAM policy references"
  value       = aws_s3_bucket.bb_bucket.arn
}

output "bucket_regional_domain_name" {
  description = "The bucket's regional domain name, CloudFront will use this as an origin"
  value       = aws_s3_bucket.bb_bucket.bucket_regional_domain_name
}