// ============================================================================
// FEATURE ITEMS FOR DIFFERENT PROPERTY CATEGORIES
// ============================================================================

// تعریف نوع برای آیتم‌های امکانات
export interface FeatureGroup {
  label: string;
  title: string;
  items: string[];
}

// تعریف نوع برای دسته‌بندی کامل امکانات
export interface FeatureCategory {
  title: string;
  fields: FeatureGroup[];
}

// مشخصه ملک
export const standardProperty: FeatureCategory = {
  title: "ویژگی‌های معماری",
  fields: [
    {
      label: "architectureStyle",
      title: "سبک",
      items: ["لوکس", "دوبلکس", "تریبلکس", "پنت هاوس", "برج باغ", "ویلای مدرن"],
    },
    {
      label: "architectureStatus",
      title: "وضعیت",
      items: [
        "خام (بدون نصبیات)",
        "بازسازی شده",
        "فول نصبیات",
        "دربست",
        "نیمه مبله",
        "فول فرنیش",
        "کلید نخورده",
      ],
    },
    {
      label: "architectureSpaces",
      title: "فضاها",
      items: [
        "نشیمن مجزا",
        "سوئیت مجزا",
        "خواب مستر",
        "لاندری",
        "تی‌وی‌وال",
        "حیاط اختصاصی",
      ],
    },
  ],
};

// مشخصه ملک
export const basementProperty: FeatureCategory = {
  title: "ویژگی‌های معماری",
  fields: [
    {
      label: "architectureStatus",
      title: "وضعیت",
      items: [
        "خام (بدون نصبیات)",
        "بازسازی شده",
        "فول نصبیات",
        "دربست",
        "نیمه مبله",
        "فول فرنیش",
        "کلید نخورده",
      ],
    },
  ],
};

export const shopProperty: FeatureCategory = {
  title: "مشخصه ملک",
  fields: [
    {
      label: "property",
      title: "",
      items: ["دودهنه", "دونبش"],
    },
  ],
};

// نما ساختمان
export const standardFacade: FeatureCategory = {
  title: "نمای ساختمان",
  fields: [
    {
      label: "facadeMaterials",
      title: "مصالح",
      items: ["سنگ", "آجر (۳ سانت)", "سیمان (سفید)", "چوب", "شیشه", "کامپوزیت"],
    },
    {
      label: "facadeStyle",
      title: "سبک",
      items: [
        "مدرن",
        "رومی",
        "کلاسیک",
        "سنتی",
        "ترکیبی",
        "نئوکلاسیک",
        "کرتین وال",
        "ترموود",
      ],
    },
  ],
};

// مشاعات
export const standardCommons: FeatureCategory = {
  title: "مشاعات عمومی",
  fields: [
    {
      label: "commonsFeatures",
      title: "امکانات تفریحی",
      items: [
        "استخر",
        "حمام ترک",
        "سونا",
        "جکوزی",
        "سالن ورزشی",
        "سالن بیلیارد",
        "سالن اجتماعات",
        "مهد کودک",
      ],
    },
    {
      label: "commonsSpaces",
      title: "فضاهای خارجی",
      items: ["روف گاردن", "حیاط", "فضای سبز", "آلاچیق", "باربیکیو", "لابی"],
    },
    {
      label: "commonsServices",
      title: "امنیت و خدمات",
      items: [
        "سرایداری",
        "دوربین مداربسته",
        "اعلام و اطفای حریق",
        "شوتینگ زباله",
        "درب ریموت دار",
        "آسانسور",
        "کارواش",
      ],
    },
  ],
};

// سرمایش و گرمایش
export const standardCoolingHeating: FeatureCategory = {
  title: "سرمایش و گرمایش",
  fields: [
    {
      label: "coolingHeating",
      title: "",
      items: [
        "پکیج و رادیاتور",
        "گرمایش از کف",
        "موتورخانه مرکزی",
        "بخاری",
        "کولر آبی",
        "اسپلیت",
        "داکت اسپلیت",
        "چیلر",
        "هواساز",
        "سیستم تهویه مطبوع",
      ],
    },
  ],
};

// پوشش کف
export const standardFloorCovering: FeatureCategory = {
  title: "پوشش‌ها",
  fields: [
    {
      label: "floorCovering",
      title: "کف",
      items: ["پارکت", "سرامیک", "سنگ", "لمینت", "موکت", "موزاییک", "سنگ اسلب"],
    },
    {
      label: "wallAndCeiling",
      title: "سقف و دیوار",
      items: [
        "نقاشی",
        "کاغذ دیواری",
        "گچ‌بری",
        "کناف",
        "رابیتس",
        "پتینه",
        "آینه‌کاری",
        "چوبکاری",
        "ورق طلا",
      ],
    },
  ],
};

// نوع آشپزخانه
export const standardKitchenType: FeatureCategory = {
  title: "آشپزخانه",
  fields: [
    {
      label: "kitchenCabinet",
      title: "کابینت",
      items: ["ام.دی.اف (MDF)", "هایگلس", "ممبران", "چوب", "فلزی"],
    },
    {
      label: "kitchenCabinetPanel",
      title: "صفحه کابینت",
      items: ["کورین", "سنگ طبیعی", "سنگ مصنوعی", "صفحه چوبی"],
    },
    {
      label: "kitchenEquipment",
      title: "تجهیزات",
      items: ["گاز رومیزی", "هود", "فر توکار", "مایکروویو توکار"],
    },
    {
      label: "kitchenSpaces",
      title: "فضاها",
      items: ["مطبخ (آشپزخانه کثیف)", "جزیره", "آشپزخانه سرد و گرم"],
    },
  ],
};

// سایر امکانات
export const standardOtherFacilities: FeatureCategory = {
  title: "سایر امکانات و امتیازات",
  fields: [
    {
      label: "otherFacilitiesSpaces",
      title: "فضاها",
      items: ["تراس", "بالکن", "پاسیو", "حیاط اختصاصی", "انباری"],
    },
    {
      label: "facilities",
      title: "امکانات",
      items: [
        "کمد دیواری",
        "شومینه",
        "لوستر",
        "نورپردازی",
        "پرده",
        "پنجره دو جداره",
        "ترمال",
        "درب ضد سرقت",
        "آیفون تصویری",
        "سیستم صوتی هوشمند",
        "آنتن مرکزی",
        "ماهواره مرکزی",
        "اینترنت مرکزی",
        "برق اضطراری",
        "جارو برقی مرکزی",
        "مخزن آب",
        "سیستم مدیریت ساختمان (BMS)",
      ],
    },
    {
      label: "points",
      title: "امتیازات",
      items: ["آب", "برق", "گاز", "تلفن (خطوط)", "فیبر نوری"],
    },
    {
      label: "parking",
      title: "پارکینگ",
      items: ["اختصاصی", "مشاع", "مزاحم", "باکس", "مسقف", "غیر مسقف"],
    },
  ],
};

export const shopOtherFacilities: FeatureCategory = {
  title: "سایر امکانات و امتیازات",
  fields: [
    {
      label: "points",
      title: "امتیازات",
      items: ["آب", "برق", "گاز", "تلفن (خطوط)", "فیبر نوری"],
    },
    {
      label: "parking",
      title: "پارکینگ",
      items: ["اختصاصی", "مشاع", "مزاحم", "باکس", "مسقف", "غیر مسقف"],
    },
  ],
};

// وضعیت ملک
export const standardEstateStatus: FeatureCategory = {
  title: "اطلاعات حقوقی و سکونتی",
  fields: [
    {
      label: "documents",
      title: "سند",
      items: [
        "تک‌برگ",
        "منگوله‌دار",
        "اوقافی",
        "قولنامه‌ای",
        "نسقی",
        "قراردادی",
        "در دست اقدام",
        "پایانکار",
        "عدم خلافی",
        "وام دار",
      ],
    },
    {
      label: "residenceStatus",
      title: "وضعیت سکونت",
      items: ["سکونت مالک", "سکونت مستاجر", "تخلیه", "قابل رهن و اجاره"],
    },
  ],
};

// وضعیت ملک برای خدماتی (شامل نوع سند)
export const serviceEstateStatus: FeatureCategory = {
  title: "اطلاعات حقوقی و سکونتی",
  fields: [
    {
      label: "documents",
      title: "سند",
      items: [
        "تک‌برگ",
        "منگوله‌دار",
        "اوقافی",
        "قولنامه‌ای",
        "نسقی",
        "قراردادی",
        "در دست اقدام",
        "پایانکار",
        "عدم خلافی",
        "وام دار",
      ],
    },
    {
      label: "documentType",
      title: "نوع سند",
      items: ["سند خدماتی", "سند مسکونی"],
    },
    {
      label: "residenceStatus",
      title: "وضعیت سکونت",
      items: ["سکونت مالک", "سکونت مستاجر", "تخلیه", "قابل رهن و اجاره"],
    },
  ],
};

// نوع سرویس بهداشتی
export const standardWcType: FeatureCategory = {
  title: "سرویس بهداشتی و حمام",
  fields: [
    {
      label: "wcType",
      title: "",
      items: ["توالت فرنگی", "توالت ایرانی", "وان", "جکوزی", "سونا"],
    },
  ],
};

export const shopWcType: FeatureCategory = {
  title: "سرویس بهداشتی",
  fields: [
    {
      label: "wcType",
      title: "",
      items: ["ایرانی", "فرنگی"],
    },
  ],
};

// نوع قرارداد (برای زمانی که قراردادی انتخاب شده)
export const contractTypes: FeatureCategory = {
  title: "نوع قرارداد",
  fields: [
    {
      label: "contractType",
      title: "",
      items: ["تعاونی", "شرکتی", "شهرداری"],
    },
  ],
};

// نوع آسانسور (برای زمانی که آسانسور انتخاب شده)
export const elevatorTypes: FeatureCategory = {
  title: "مشاعات عمومی",
  fields: [
    {
      label: "elevatorType",
      title: "نوع آسانسور",
      items: ["نفر بر", "باری"],
    },
  ],
};
