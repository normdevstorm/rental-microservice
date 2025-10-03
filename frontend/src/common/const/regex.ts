/* eslint-disable no-useless-escape */
/* eslint-disable prefer-regex-literals */
const regexInsta = new RegExp(
  /^(?:https?:\/\/)(?:www\.)?(?:instagram\.com|instagr\.am|instagr\.com)\/(\w+)/i
);

const regexFb = new RegExp(
  /^(?:https?:\/\/)(?:www\.)?(?:facebook|fb|m\.facebook)\.(?:com|me)\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-\.]+)(?:\/)?/i
);

const regexTwitter = new RegExp(
  /^(?:https?:\/\/)(?:www\.)?(?:mobile\.twitter|twitter|x)\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/i
);

const regexTiktok = new RegExp(
  /^(?:https?:\/\/)(?:www\.|m\.)?(?:tiktok)\.com\/|^$/i
);

const regexWebsite = new RegExp(
  /^(?:https?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+$/
);

const regUserName = new RegExp(/^[a-zA-Z0-9_\.]+$/);

const regexNumber = new RegExp(/^\d+$/);

const regexNumberNotStart0 = new RegExp(/^[1-9a-zA-Z][0-9]*$/);

const regexNumberInteger = new RegExp(/^\d+$/);

const regexAge = new RegExp(/^[0-9]?[0-9][-][0-9][0-9]?$|^100$/);

const regexSpace = new RegExp(/^\S+$/);
const regexAllSpace = new RegExp(/\S/);
const regexNoSpecialCharAndSpace = new RegExp(/[\^°<>#@&()=`*~!"'§$%?®©¶ ]+/);

// const regexPass = new RegExp(/^(?=.*[A-Z])(?=.*\d).{8,}$/);
const regexPass = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()-_+=]{8,}$/);

const regexZentorName = new RegExp(
  /^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/g
);

const regexTimeZenfocus = new RegExp(/^\d{2}:\d{2}:\d{2}\-\d{2}:\d{2}:\d{2}$/)

const regexYoutube = new RegExp(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)

const regexKeyWords = new RegExp(/^[^,]+(,[^,]+)*$/)

const regexHHmm = new RegExp(/([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
const regexLink = new RegExp(
  /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/
);

export const regex = {
  regexPass,
  regexInsta,
  regexFb,
  regexTwitter,
  regexTiktok,
  regexWebsite,
  regexNumber,
  regexNumberNotStart0,
  regexAge,
  regUserName,
  regexSpace,
  regexAllSpace,
  regexNoSpecialCharAndSpace,
  regexZentorName,
  regexTimeZenfocus,
  regexYoutube,
  regexKeyWords,
  regexNumberInteger,
  regexHHmm,
  regexLink
};
