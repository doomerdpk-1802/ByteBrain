variable "instance_name" {
  description = "Name for the EC2 instance"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
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


variable "root_volume_size" {
  description = "Root EBS volume size in GB"
  type        = number
  default     = 15
}

variable "tags" {
  description = "Additional tags"
  type        = map(string)
  default     = {}
}

variable "cpu_credits" {
  description = "CPU credits for T2/T3 instances (standard or unlimited)"
  type = string
  default = "standard"
}