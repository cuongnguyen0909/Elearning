import { Document, Model } from 'mongoose'

interface IMonthData {
    month: string
    count: number
}

export async function generateLast12MonthsData<T extends Document>(
    model: Model<T>
): Promise<{ last12Months: IMonthData[] }> {
    const last12Months: IMonthData[] = []
    const currentDate = new Date()
    // Giả sử hôm nay là 20 tháng 10 năm 2024 vào lúc 10:00 sáng.
    // Nếu không tăng thêm một ngày, endDate sẽ là ngày 20/10/2024 10:00 sáng,
    // và tất cả các tài liệu được tạo sau 10:00 sáng sẽ không được tính.
    // Nhưng khi tăng thêm một ngày, endDate sẽ trở thành 21/10/2024 10:00 sáng,
    // đảm bảo tính toàn bộ các tài liệu từ ngày 20/10 (cả ngày) và các giờ sau đó.
    currentDate.setDate(currentDate.getDate() + 1)

    // i = 11: Tính toán cho tháng xa nhất là khoảng thời gian cách đây 11 tháng (tháng 11 năm trước).
    // i = 0: Tính toán cho tháng hiện tại (tháng 10 năm 2024).
    // Việc duyệt từ 11 về 0 sẽ đưa dữ liệu của từng tháng vào mảng một cách có trật tự,
    // từ tháng xa nhất đến gần nhất.
    for (let i = 11; i >= 0; i--) {
        // Ví dụ thực tế với i = 11:
        // Nếu hôm nay là 20 tháng 10, 2024, khi i = 11, chúng ta tính 20 - 11 * 28 = -288.
        // JavaScript sẽ tự điều chỉnh và tính rằng 288 ngày trước đó là ngày 6 tháng 12, 2023.
        // startDate = endDate - 28 ngày = 6 tháng 11, 2023.
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i * 28)
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), endDate.getDate() - 28)

        // chuyển định dạng ngày tháng năm sang dạng "ngày tháng năm"
        // vi dụ: 20 tháng 10, 2024 -> "20 Oct 2024"
        const monthYear = endDate.toLocaleString('default', { day: 'numeric', month: 'short', year: 'numeric' })

        // Đếm số lượng tài liệu được tạo trong khoảng thời gian từ startDate đến endDate.
        const count = await model.countDocuments({
            createdAt: {
                $gte: startDate,
                $lt: endDate
            }
        })
        // Thêm dữ liệu của tháng này vào mảng last12Months.
        // Ví dụ: { month: "20 Oct 2024", count: 10 }
        last12Months.push({ month: monthYear, count })
    }

    return {
        last12Months
    }
}
