import {getToken} from "@/utils/auth";

exports.headers = {Authorization: "Bearer " + getToken()}

exports.url =  process.env.VUE_APP_BASE_API + "admin/user/import"

exports.avatarUrl=process.env.VUE_APP_BASE_API + "admin/file/upload/avatar"
