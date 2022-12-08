const PHONE_REGEX = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
const EMAIL_REGEX = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const REACT_APP_API_URL = 'http://localhost:22081'
const REACT_APP_API_PUBLIC_IMAGE_FOLDER_URL = 'Images'

export { PHONE_REGEX, EMAIL_REGEX, REACT_APP_API_URL, REACT_APP_API_PUBLIC_IMAGE_FOLDER_URL }