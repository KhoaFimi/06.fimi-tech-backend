import { CampaignLinkType } from '@prisma/client'
import { z } from 'zod'

export const campaignSchema = z.object({
	id: z.string(),
	code: z.string().min(1, { message: 'Vui lòng nhập mã chiến dịch' }),
	name: z.string().min(1, { message: 'Vui lòng nhập tên chiến dịch' }),
	advertiser: z
		.string()
		.min(1, { message: 'Vui lòng nhập tên nhà cung cấp sản phẩm' }),
	link: z
		.object({
			type: z.nativeEnum(CampaignLinkType),
			base: z.string()
		})
		.refine(val => val.base !== '', {
			message: 'vui lòng thêm link giới thiệu cho chiến dịch'
		}),
	categoryId: z
		.string()
		.min(1, { message: 'Vui lòng lựa chọn danh mục cho chiến dịch' }),
	images: z.array(z.string()).refine(val => val.length < 1, {
		message: 'Vui lòng bổ sung ít nhất 1 hình ảnh sản phẩm'
	}),
	video: z.string().optional().nullish(),
	campaignOffers: z
		.array(
			z.object({
				title: z
					.string()
					.min(1, { message: 'Vui lòng nhập tiêu đề cho ưu đãi' }),
				sumary: z
					.string()
					.min(1, { message: 'Vui lòng nhập thông tin tóm tắt của ưu đãi' }),
				offer: z.array(z.string())
			})
		)
		.refine(val => val.length < 1, {
			message: 'Vui lòng thêm ít nhất 1 ưu đãi cho chiến dịch'
		}),
	info: z.object({
		supportArea: z.union([z.string().default('all'), z.array(z.string())], {
			message: 'Vui lòng nhập khu vữ hỗ trợ '
		}),
		approveTime: z
			.string()
			.min(1, { message: 'Vui lòng nhập thời gian phê duyệt' }),
		finalResultTime: z
			.string()
			.min(1, { message: 'Vui lòng nhập thời gian trả kết quả' })
	}),
	specs: z
		.array(
			z.object({
				title: z
					.string()
					.min(1, { message: 'Vui lòng nhập tiêu đề cho thông tin sản phẩm' }),
				description: z
					.array(z.string().min(1, { message: 'Vui lòng thêm mô tả sản phẩm' }))
					.refine(val => val.length < 1, {
						message: 'Vui lòng thêm tối thiểu 1 mô tả sản phẩm'
					})
			})
		)
		.refine(val => val.length < 1, {
			message: 'Vui lòng thêm ít nhất 1 thông tin sản phẩm'
		}),
	commissionPolicy: z.object({
		status: z.string().default('APPROVED'),
		description: z.string().default('Ghi nhận hoa hồng'),
		commissions: z.array(
			z
				.string()
				.min(1, { message: 'Vui lòng thêm hoa hồng' })
				.refine(val => val.length < 1, {
					message: 'Vui lòng nhập hoa hồng thành toán '
				})
		),
		note: z.string().optional().nullish()
	}),
	recognitionRules: z.object({
		summary: z
			.string()
			.min(1, { message: 'Vui lòng nhập tóm tắt về quy tắc ghi nhận' }),
		description: z.array(z.string()).refine(val => val.length < 1, {
			message: 'Vui lòng nhập ít nhất 1 mô tả'
		}),
		note: z.string().optional().nullish()
	}),
	registrationProcess: z.array(z.string()).refine(val => val.length < 1, {
		message: 'Quy trình đăng ký phải có ít nhất 1 bước'
	}),
	rejectReason: z.array(z.string()).refine(val => val.length < 1, {
		message: 'Vui lòng nhập tối thiểu 1 ký di từ chối'
	}),
	unqualifiedRecords: z.array(z.string()).refine(val => val.length < 1, {
		message: 'Thêm ít nhất 1 loại giấy tờ không hợp lệ'
	}),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date()
})
