


export const HOST=import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES="api/auth";
export const SIGNUP_ROUTES=`${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE=`${AUTH_ROUTES}/login`;
export const GET_USER_INFO= `${AUTH_ROUTES}/user-info`;
export const GET_MEMBER_INFO= `${AUTH_ROUTES}/members-info`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`;
export const UPDATE_GROUP_INFO = `${AUTH_ROUTES}/update-group-profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`;
export const ADD_GROUP_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-group-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove-profile-image`;
export const REMOVE_GROUP_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove-group-profile-image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;
export const ADD_BUDDY=`${AUTH_ROUTES}/add-buddy`;

export const CONTACTS_ROUTES = "api/contacts";
export const SEARCH_CONTACTS_ROUTES = `${CONTACTS_ROUTES}/search`;
export const GET_DM_CONTACTS_ROUTES
= `${CONTACTS_ROUTES}/get-contacts-for-dm`;
export const GET_All_CONTACTS_ROUTES = `${CONTACTS_ROUTES}/get-all-contacts`;

export const MESSAGES_ROUTES = "api/messages";
export const GET_ALL_MESSAGES_ROUTES = `${MESSAGES_ROUTES}/get-messages`;
export const UPLOAD_FILE_ROUTE = `${MESSAGES_ROUTES}/upload-file`;

export const CHANNEL_ROUTES ="api/channel";
export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTES}/create-channel`;
export const GET_USER_CHANNELS_ROUTE = `${CHANNEL_ROUTES}/get-user-channels`;
export const GET_CHANNEL_MESSAGES = `${CHANNEL_ROUTES}/get-channel-messages`;
export const ADD_MEMBER = `${CHANNEL_ROUTES}/add-member`;

export const FILTER_ROUTES="api/filters";
export const GET_RECOMMENDED_BUDDIES=`${FILTER_ROUTES}/buddies`;
export const GET_RECOMMENDED_GROUPS=`${FILTER_ROUTES}/groups`;

export const NOTIFICATIONS_ROUTES="api/notifications";
export const GET_ALL_NOTIFICATIONS=`${NOTIFICATIONS_ROUTES}/get-notifications`
export const MARK_AS_READ = `${NOTIFICATIONS_ROUTES}/markAsRead-notifications`
export const DELETE = `${NOTIFICATIONS_ROUTES}/delete-notifications`