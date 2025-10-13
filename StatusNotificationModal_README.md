# StatusNotificationModal - بهبود یافته

## تغییرات اعمال شده

### 1. بهبود UI/UX

- **طراحی مدرن**: استفاده از رنگ‌های بهتر و فاصله‌گذاری مناسب
- **انیمیشن‌ها**: اضافه کردن انیمیشن‌های نرم برای تعامل بهتر
- **حالت‌های مختلف**: نمایش حالت‌های مختلف برای دکمه‌ها (آپلود، حذف، ویرایش)
- **خلاصه اطلاعات**: نمایش خلاصه‌ای از اطلاعات وارد شده قبل از ارسال

### 2. قابلیت آپلود فایل

- **آپلود مستقیم**: فایل‌ها بلافاصله پس از انتخاب آپلود می‌شوند
- **استفاده از `useUploadFileChunking`**: برای آپلود چانک‌بندی شده و نمایش پیشرفت واقعی
- **نمایش درصد واقعی**: استفاده از درصد پیشرفت واقعی hook به جای simulation
- **Drag & Drop**: امکان کشیدن و رها کردن فایل‌ها
- **پیش‌نمایش فایل‌ها**: نمایش آیکون مناسب برای هر نوع فایل
- **مدیریت فایل‌ها**: امکان حذف فایل‌های آپلود شده
- **انتخاب نوع آپلود**: امکان انتخاب بین تک فایل و چند فایل

### 3. ویژگی‌های جدید

- **انتخاب نوع آپلود**: `isMultipleFiles` برای انتخاب بین تک فایل و چند فایل
- **محدودیت تعداد فایل**: تنظیم حداکثر تعداد فایل قابل آپلود
- **انواع فایل مجاز**: تعیین انواع فایل قابل قبول
- **نمایش پیشرفت**: نمایش درصد پیشرفت آپلود هر فایل
- **مدیریت خطا**: مدیریت خطاهای آپلود

## نحوه استفاده

### پارامترهای جدید

```typescript
type TProps = {
  // ... پارامترهای قبلی

  // قابلیت فایل
  isHaveFiles?: boolean; // فعال کردن آپلود فایل
  filesLabel?: string; // برچسب بخش فایل‌ها
  maxFiles?: number; // حداکثر تعداد فایل (پیش‌فرض: 5)
  acceptedFileTypes?: string; // انواع فایل مجاز
  isMultipleFiles?: boolean; // آپلود چند فایل (پیش‌فرض: false)

  // ... سایر پارامترها
};
```

### مثال استفاده تک فایل

```tsx
<StatusNotificationModal
  title="آپلود فایل"
  description="فایل مورد نظر را انتخاب کنید:"
  onSubmit={handleSubmit}
  actionName="آپلود"
  isHaveFiles={true}
  isMultipleFiles={false}
  acceptedFileTypes="image/*,.pdf,.doc,.docx">
  <span>آپلود فایل</span>
</StatusNotificationModal>
```

### مثال استفاده چند فایل

```tsx
<StatusNotificationModal
  title="آپلود فایل‌ها"
  description="فایل‌های مورد نظر را انتخاب کنید:"
  onSubmit={handleSubmit}
  actionName="آپلود"
  isHaveFiles={true}
  isMultipleFiles={true}
  maxFiles={3}
  acceptedFileTypes="image/*,.pdf,.doc,.docx">
  <span>آپلود فایل‌ها</span>
</StatusNotificationModal>
```

### مثال استفاده کامل

```tsx
<StatusNotificationModal
  title="ایجاد درخواست جدید"
  description="اطلاعات درخواست جدید را وارد کنید:"
  onSubmit={handleSubmit}
  actionName="ایجاد"
  colorVariant="blue"
  isHaveTitle={true}
  isHaveDescription={true}
  isHaveFiles={true}
  isMultipleFiles={true}
  titleLabel="عنوان درخواست"
  descriptionLabel="توضیحات درخواست"
  filesLabel="مستندات"
  maxFiles={5}
  acceptedFileTypes="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx">
  <span>ایجاد درخواست کامل</span>
</StatusNotificationModal>
```

## تابع onSubmit

تابع `onSubmit` حالا سه پارامتر دریافت می‌کند:

```typescript
const handleSubmit = async (
  title?: string,
  description?: string,
  files?: Array<{
    url: string;
    file_name: string;
    key: string;
    mimeType: string;
  }>,
): Promise<boolean> => {
  // پردازش اطلاعات
  console.log("Title:", title);
  console.log("Description:", description);
  console.log("Files:", files);

  // بازگشت true برای بستن مودال
  return true;
};
```

## ویژگی‌های فایل آپلود

### انواع فایل پشتیبانی شده

- **تصاویر**: `image/*` (jpg, png, gif, webp, etc.)
- **ویدیوها**: `video/*` (mp4, avi, mov, etc.)
- **مستندات**: `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`
- **سایر فایل‌ها**: قابل تنظیم

### محدودیت‌ها

- **تعداد فایل**: قابل تنظیم (پیش‌فرض: 5)
- **اندازه فایل**: طبق تنظیمات سرور
- **انواع فایل**: قابل تنظیم
- **نوع آپلود**: انتخاب بین تک فایل و چند فایل

### حالت‌های نمایش

- **در حال آپلود**: نمایش پیشرفت آپلود با درصد
- **آپلود شده**: نمایش فایل‌های موفق
- **خطا**: مدیریت خطاهای آپلود

## بهبودهای UI

### رنگ‌بندی

- **آبی**: برای عملیات‌های عادی
- **سبز**: برای عملیات‌های مثبت
- **قرمز**: برای عملیات‌های حذف

### انیمیشن‌ها

- **Hover effects**: تغییر رنگ و سایه
- **Loading states**: نمایش وضعیت بارگذاری
- **Progress bars**: نمایش پیشرفت آپلود

### Responsive Design

- **موبایل**: بهینه‌سازی برای صفحات کوچک
- **دسکتاپ**: استفاده کامل از فضای موجود
- **Tablet**: سازگاری با صفحات متوسط

## نکات مهم

1. **آپلود خودکار**: فایل‌ها بلافاصله پس از انتخاب آپلود می‌شوند
2. **استفاده از `useUploadFileChunking`**: برای آپلود چانک‌بندی شده و نمایش پیشرفت واقعی
3. **نمایش درصد واقعی**: استفاده از درصد پیشرفت واقعی hook به جای simulation
4. **انتخاب نوع آپلود**: `isMultipleFiles` برای کنترل تعداد فایل‌ها
5. **مدیریت خطا**: خطاهای آپلود به صورت خودکار مدیریت می‌شوند
6. **بازنشانی فرم**: فرم پس از ارسال موفق بازنشانی می‌شود
7. **اعتبارسنجی**: بررسی محدودیت‌های تعداد و نوع فایل
8. **تجربه کاربری**: رابط کاربری ساده و قابل فهم

## مثال‌های استفاده

### تک فایل

```tsx
<StatusNotificationModal
  isHaveFiles={true}
  isMultipleFiles={false}
  maxFiles={1}>
  <span>آپلود تک فایل</span>
</StatusNotificationModal>
```

### چند فایل

```tsx
<StatusNotificationModal isHaveFiles={true} isMultipleFiles={true} maxFiles={5}>
  <span>آپلود چند فایل</span>
</StatusNotificationModal>
```

### بدون محدودیت تعداد

```tsx
<StatusNotificationModal
  isHaveFiles={true}
  isMultipleFiles={true}
  maxFiles={10}>
  <span>آپلود تا 10 فایل</span>
</StatusNotificationModal>
```

کامپوننت حالا بسیار انعطاف‌پذیر است و می‌تواند برای انواع مختلف عملیات (افزودن، ویرایش، حذف، آپلود) با قابلیت انتخاب بین تک فایل و چند فایل استفاده شود! 🎉
