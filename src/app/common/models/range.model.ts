export const Range = {
    CESH: 75, //CES
    CESL: 55, //CES
    RECALLH: 75, //Recall
    RECALLL: 55, //Recall
    CLH: 0.8, //CognitiveLoad
    CLL: 0.4, //CognitiveLoad
    ADCOPYEH: 75, //AdCopyEffe
    ADCOPYEL: 55, //AdCopyEffe
    ADCOPYCH: 0.8, //AdCopyComp
    ADCOPYCL: 0.4,
    DESIGNCH: 0.8, //DesignCompl
    DESIGNCL: 0.4,
    TEXTRH: 75, //TextRatio
    TEXTRL: 55,
    ATTNH: 86, //Attention
    ATTNL: 70,
    // ATTNNA: 50,
    WD: 12, //wordDensity
    TCR: 1, //TextContrast
    FVH: 3, //FontV
    FVM: 2,
    FVL: 1,
    BCH: 86, //BrandCompliance
    BCL: 72,
    BLCH: 9, //BrandLogoContrast
    BLCL: 3,
    BPCH: 6, //BrandProductContrast
    BPCL: 3,
    BLRSH: 0.1, //logoRelativeSize
    BLRSL: 0.01,
    BPRSH: 0.4, //productRelativeSize
    BPRSL: 0.2,
    BRSH: 0.5, 
    BRSL: 0.1,
    CCH: 53,
    CCL: 17,
    LVBH: 40,
    LVBL: 8,
    PVBH: 30,
    PVBL: 10,
    ACVBH: 90.14,
    ACVBL: 33.66,
    EIH: 75,
    EIL: 55,
    DAH: 75,
    DAL: 55,
    PERH: 3,
    PERL: 1,
    PERM: 2,
}

export const Recall = {
    high: "The memorability of the ad will be high, and will lead to higher engagement.",
    medium: "The ad misses the mark! Refer to the detailed section for more insights.",
    low: "Your ad needs improvement, the memorability is low which can result in low engagement."
}

export const Attention = {
    high: "Indicates high memorability of the ad.",
    medium: "Indicates medium memorability of the ad.",
    low: "Indicates low memorability of the ad."
}

export const Cognitive = {
    high: "This ad is difficult to comprehend which can result in low brand recall and engagement. Refer to the details section for more insights.",
    medium: "The sweet spot! This ad is the perfect mix of the right kind of visuals and ad copy and will result in high brand recall and engagement.",
    low: "Low cognitive load leads to lower engagement and a high bounce-off rate. We recommend optimizing for a balanced score."
}

export const AdCopy = {
    high: "The ad copy communicates the ad's message and will persuade viewers to take action.",
    medium: "Ad copy could be more clear, concise, and persuasive. Refer to the details section for more insights.",
    low: "The ad copy does not communicate the ad message effectively. We recommend optimizing for a high score."
}

export const Persuasive = {
    high: "A persuasive ad copy encourages the viewer to take action and increases ad copy effectiveness.",
    medium: "Craft a better ad copy to encourage the viewer to take action, thereby increasing ad copy effectiveness.",
    low:  "Text Persuasiveness needs improvement. A high value encourages the viewer to take action thereby improving ad copy effectiveness."
}

export const TextReadability = {
    high: "High text readability means that the text is clear and comprehendible which impacts revenue.",
    medium: "The text readability of the ad is average, it can be improved to persuade the viewer to take action thereby increasing revenue.",
    low: "The text readability is low, ensure that the text on the ad copy is clear and comprehendible for the viewer to increase revenue."
}

export const TextAttention = {
    high: "Attention on the ad copy is high, thereby increasing the ad copy effectiveness.",
    medium: "Attention on the text can be improved to increase ad copy effectiveness.",
    low: "Text Attention is low, make suitable edits to improve ad copy effectiveness."
}

export const BrandCompliance = {
    high: "Your ad is high in brand compliance thereby increasing brand recall may impact revenue positively up to 33%.",
    medium: "Brand compliance can be improved to ensure higher brand recall and revenue.",
    low: "Low brand compliance can lead to low brand recall and revenue."
}

export const BrandRecognition = {
    high: "Your ad is high in brand recognition thereby increasing brand awareness and ROI.",
    medium: "Brand recognition can be improved to ensure better brand awareness and ROI.",
    low: "Low brand recognition can lead to low brand awareness and ROI."
}

export const Digital = {
    high: "The ad scores well on Digital Accessibility making it optimal for differently abled audiences to view your ad, improving ROAS.",
    medium: "Digital accessibility is medium, your ad could be difficult for differently abled audiences to view, impacting ROAS.",
    low: "Digital accessibility is low, making modifications to improve your ad for all audiences to view which reduces ROAS."
}

export const Color = {
    high: "A high color contrast increases readability and memorability.",
    medium: "Your ad's color contrast can be improved for better readability and memorability.",
    low: "Your ad's color contrast needs modifications to increase readability and memorability."
}