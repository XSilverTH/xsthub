export interface HttpError {
  code: number
  phrase: string
  title: string
  message: string
}

// All standard 4xx/5xx statuses, in numeric order.
export const HTTP_ERRORS: HttpError[] = [
  { code: 400, phrase: 'Bad Request', title: 'That request got scrambled', message: 'The server couldn’t make sense of what your browser sent. Check the link for typos, then give it another shot.' },
  { code: 401, phrase: 'Unauthorized', title: 'Locked — you need to log in', message: 'This corner of the site needs credentials. Sign in first, then come back and try again.' },
  { code: 402, phrase: 'Payment Required', title: 'This one has a cover charge', message: 'Access here needs payment before the server will play along. (Yes, really — it’s in the spec.)' },
  { code: 403, phrase: 'Forbidden', title: 'Nope — you can’t come in', message: 'The server understood your request perfectly and said no. This area is off-limits for your account.' },
  { code: 404, phrase: 'Not Found', title: 'Lost in the void', message: 'The page you’re after isn’t on this hub. It may have moved, or the link took a wrong turn somewhere.' },
  { code: 405, phrase: 'Method Not Allowed', title: 'Wrong move for this spot', message: 'That action isn’t welcome here. The page exists, but not for that kind of request.' },
  { code: 406, phrase: 'Not Acceptable', title: 'Can’t serve your format', message: 'The server can’t produce a version of this page your browser will accept. Try different settings.' },
  { code: 407, phrase: 'Proxy Authentication Required', title: 'The middleman wants ID', message: 'A proxy between you and the site is asking you to authenticate before it lets you through.' },
  { code: 408, phrase: 'Request Timeout', title: 'You took too long', message: 'The server waited patiently, but your request never fully arrived. Try again when the connection is steadier.' },
  { code: 409, phrase: 'Conflict', title: 'Something changed underneath you', message: 'Your request collided with the current state of things. Refresh the page and try once more.' },
  { code: 410, phrase: 'Gone', title: 'Gone for good', message: 'Whatever lived at this address has been permanently removed. There’s no forwarding address.' },
  { code: 411, phrase: 'Length Required', title: 'How big is it, exactly?', message: 'The server needs to know the size of your request before it can proceed. Your client skipped that detail.' },
  { code: 412, phrase: 'Precondition Failed', title: 'Conditions weren’t met', message: 'One of your request’s preconditions failed, so the server left everything untouched. Nothing changed.' },
  { code: 413, phrase: 'Content Too Large', title: 'That’s way too much', message: 'Your upload is bigger than the server is willing to swallow. Trim it down and try again.' },
  { code: 414, phrase: 'URI Too Long', title: 'That link is enormous', message: 'The address you requested is longer than the server cares to read. Shorten it and retry.' },
  { code: 415, phrase: 'Unsupported Media Type', title: 'We don’t speak that format', message: 'The file or data type you sent isn’t supported here. Convert it and come back.' },
  { code: 416, phrase: 'Range Not Satisfiable', title: 'Nothing beyond this point', message: 'The piece of the file you asked for doesn’t exist. There’s nothing beyond this point.' },
  { code: 417, phrase: 'Expectation Failed', title: 'Couldn’t meet expectations', message: 'The server couldn’t live up to what your request expected of it. Lower the bar slightly.' },
  { code: 418, phrase: "I'm a Teapot", title: 'Refusing to brew coffee', message: 'The server is, permanently and proudly, a teapot. It will not brew you coffee. (An old internet joke, enshrined as law.)' },
  { code: 421, phrase: 'Misdirected Request', title: 'Wrong server, sorry', message: 'Your request reached a server that can’t answer for it. Try again — routing usually sorts itself out.' },
  { code: 422, phrase: 'Unprocessable Content', title: 'Looks right, makes no sense', message: 'Your request was well-formed, but its instructions don’t add up. Fix the details and retry.' },
  { code: 423, phrase: 'Locked', title: 'Currently under lock', message: 'The thing you’re after is locked. It isn’t going anywhere until someone unlocks it.' },
  { code: 425, phrase: 'Too Early', title: 'Too early — come back soon', message: 'The server isn’t willing to gamble on such an early request. Wait a moment, then retry.' },
  { code: 426, phrase: 'Upgrade Required', title: 'Time to level up', message: 'You’ll need to switch to a newer protocol before the server continues this conversation.' },
  { code: 428, phrase: 'Precondition Required', title: 'Needs some conditions', message: 'The server needs conditions attached before it takes this request seriously. Your client sent none.' },
  { code: 429, phrase: 'Too Many Requests', title: 'Whoa — slow down', message: 'Too many requests, too fast. Take a breath, wait a moment, then try again.' },
  { code: 431, phrase: 'Request Header Fields Too Large', title: 'Your headers are overweight', message: 'Your browser sent more header data than the server will carry. Clear cookies and try again.' },
  { code: 451, phrase: 'Unavailable For Legal Reasons', title: 'Blocked for legal reasons', message: 'This page is unavailable where you are, for legal reasons. The lawyers send their regards.' },
  { code: 500, phrase: 'Internal Server Error', title: 'We tripped over ourselves', message: 'Something broke on our side — it’s not you. The hub is already being poked about it.' },
  { code: 501, phrase: 'Not Implemented', title: 'Nobody built that yet', message: 'The server doesn’t know how to do that. This one is genuinely, honestly unimplemented.' },
  { code: 502, phrase: 'Bad Gateway', title: 'Upstream said something weird', message: 'A server we depend on gave a bad answer, so there’s nothing good to show you right now.' },
  { code: 503, phrase: 'Service Unavailable', title: 'Taking a quick nap', message: 'The service is temporarily down — maintenance, overload, or a well-earned rest. Try again soon.' },
  { code: 504, phrase: 'Gateway Timeout', title: 'Upstream never answered', message: 'A server we depend on took too long to reply, so we gave up waiting. Try again in a bit.' },
  { code: 505, phrase: 'HTTP Version Not Supported', title: 'Wrong era, wrong protocol', message: 'The server doesn’t support that HTTP version. Your client is speaking from another time.' },
  { code: 506, phrase: 'Variant Also Negotiates', title: 'Negotiated in circles', message: 'The server got tangled negotiating variants with itself. Try again — it usually untangles.' },
  { code: 507, phrase: 'Insufficient Storage', title: 'Completely out of room', message: 'The server has no space left to store that. Something needs deleting before this can proceed.' },
  { code: 508, phrase: 'Loop Detected', title: 'Caught in a loop', message: 'The servers detected an infinite loop and stepped away. Try a different path.' },
  { code: 510, phrase: 'Not Extended', title: 'Needs extensions we lack', message: 'This request needs extensions the server doesn’t have. Nothing personal.' },
  { code: 511, phrase: 'Network Authentication Required', title: 'This Wi-Fi wants a login', message: 'The network you’re on wants you to log in first — look for a captive portal or sign-in page.' },
]

export const ERROR_CODES = HTTP_ERRORS.map((error) => error.code)
