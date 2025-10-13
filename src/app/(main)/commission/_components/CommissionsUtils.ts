export const calcSale = (price: number, commissionRate?: number) => {
  let base = 0;

  if (commissionRate !== undefined) {
    // اگه درصد کمیسیون دستی داده شد
    base = price * commissionRate;
  } else {
    // درصد پیش‌فرض
    if (price <= 700_000_000) {
      base = price * 0.005; // 0.5%
    } else {
      base = 700_000_000 * 0.005 + (price - 700_000_000) * 0.0025; // 0.5% و 0.25%
    }
  }

  // مالیات 10%
  const tax = base * 0.1;
  const total = commissionRate ? base : base + tax;

  return {
    base, // کمیسیون بدون مالیات
    tax, // مالیات
    total, // کمیسیون کل
    buyer: total / 2, // سهم خریدار
    seller: total / 2, // سهم فروشنده
  };
};

export const calcRent = (rahn: number, ejareh: number) => {
  // 1. رهن × 1%
  const rahnConverted = rahn * 0.01;

  // 2. اجاره ÷ 4
  const ejarehConverted = ejareh / 4;

  // 3. جمع دو مقدار
  const base = rahnConverted + ejarehConverted;

  // 4. مالیات 10%
  const tax = base * 0.1;

  // 5. جمع نهایی
  const total = base + tax;

  return {
    base, // کمیسیون بدون مالیات
    tax, // مالیات
    total, // کمیسیون کل
    owner: total / 2, // سهم موجر
    tenant: total / 2, // سهم مستأجر
  };
};
