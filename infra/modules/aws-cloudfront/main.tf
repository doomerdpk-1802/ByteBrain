# OAC (Origin access control) — S3 should be accessible via Cloufront only. S3 bucket should be private
resource "aws_cloudfront_origin_access_control" "this" {
  name                              = "oac-${var.bucket_id}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# A aws_cloudfront_distribution resource created via Terraform always uses pay-as-you-go pricing by default. There's no Terraform argument to attach it to a flat-rate plan.
# Adding custom domain + ACM cert — ACM certs for CloudFront are free; no cost there
resource "aws_cloudfront_distribution" "this" {
  enabled             = true
  # file served at /
  default_root_object = var.default_root_object
  price_class         = var.price_class
  is_ipv6_enabled     = true
  web_acl_id                      = "arn:aws:wafv2:us-east-1:168787218437:global/webacl/CreatedByCloudFront-a7deff4b/752e2f2c-525e-4a2b-949b-160eb717c13e"

  origin {
    domain_name              = var.bucket_regional_domain_name
    origin_id                = var.bucket_id
    origin_access_control_id = aws_cloudfront_origin_access_control.this.id
  }

  default_cache_behavior {
    target_origin_id       = var.bucket_id
    viewer_protocol_policy = "redirect-to-https" 
    #  no backend writes
    allowed_methods         = ["GET", "HEAD"]
    cached_methods           = ["GET", "HEAD"]
    compress                 = true

    cache_policy_id = data.aws_cloudfront_cache_policy.caching_optimized.id
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true 
    minimum_protocol_version       = "TLSv1"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }
}

data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}

# Bucket policy that ONLY allows this specific CloudFront distribution to read the bucket
data "aws_iam_policy_document" "s3_oac_policy" {
  statement {
    sid    = "AllowCloudFrontServicePrincipalReadOnly"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions   = ["s3:GetObject"]
    resources = ["${var.bucket_arn}/*"]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.this.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "allow_cloudfront" {
  bucket = var.bucket_id
  policy = data.aws_iam_policy_document.s3_oac_policy.json
}