module "aws-s3" {
  source      = "./modules/aws-s3"
  bucket_name = var.bucket_name
}

module "aws-cloudfront" {
  source                      = "./modules/aws-cloudfront"
  bucket_id                   = module.aws-s3.bucket_id
  bucket_arn                  = module.aws-s3.bucket_arn
  bucket_regional_domain_name = module.aws-s3.bucket_regional_domain_name
}