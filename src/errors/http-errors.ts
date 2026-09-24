export interface HttpError {
  code: number
  phrase: string
  title: string
  message: string
}

// All standard 4xx/5xx statuses, in numeric order.
export const HTTP_ERRORS: HttpError[] = [
  // { code: 400, phrase: 'Bad Request', title: 'That request broke grammar', message: 'The server couldn’t make sense of what your browser sent. Check the link for typos.' },
  // { code: 401, phrase: 'Unauthorized', title: 'Papers, please', message: 'Knock knock. Who\'s there? Not you, apparently.'},
  // { code: 402, phrase: 'Payment Required', title: 'This one has a cover charge', message: 'Access here needs payment before the server will play along.' },
  { code: 403, phrase: 'Forbidden', title: 'You shall not pass', message: 'Your credentials check out, but this door is not yours to open.' },
  { code: 404, phrase: 'Not Found', title: 'Lost in the void', message: 'The page you’re after isn’t here. It may have moved, or the link took a wrong turn somewhere.' },
  // { code: 405, phrase: 'Method Not Allowed', title: 'Wrong move for this spot', message: 'That action isn’t welcome here. The page exists, but not for that kind of request.' },
  // { code: 406, phrase: 'Not Acceptable', title: 'Can’t serve your format', message: 'The server can’t produce a version of this page your browser will accept.' },
  // { code: 407, phrase: 'Proxy Authentication Required', title: 'The middleman wants ID', message: 'A proxy between you and the site is asking you to authenticate before it lets you through.' },
  // { code: 408, phrase: 'Request Timeout', title: 'You took too long', message: 'Time\'s up. The server got tired of waiting and hung up.' },
  // { code: 409, phrase: 'Conflict', title: 'Something changed underneath you', message: 'Your request contradicts the current state someone else changed it first. Refresh the page before trying again.' },
  // { code: 410, phrase: 'Gone', title: 'Gone for good', message: 'Whatever lived at this address has been permanently removed.' },
  // { code: 411, phrase: 'Length Required', title: 'How big is it, exactly?', message: 'The server needs to know the size of your request before it can proceed.' },
  // { code: 412, phrase: 'Precondition Failed', title: 'Conditions weren’t met', message: 'One of your request’s preconditions failed, so the server left everything untouched. Nothing changed.' },
  // { code: 413, phrase: 'Content Too Large', title: 'That’s way too big', message: 'Your upload is bigger than the server is willing to take in.' },
  // { code: 414, phrase: 'URI Too Long', title: 'That link is enormous', message: 'The address you requested is longer than the server cares to read.' },
  // { code: 415, phrase: 'Unsupported Media Type', title: 'We don’t speak that format', message: 'The file or data type you sent isn’t supported here.' },
  // { code: 416, phrase: 'Range Not Satisfiable', title: 'Past the end', message: 'The byte range you requested starts beyond the resource\'s size.' },
  // { code: 417, phrase: 'Expectation Failed', title: 'Couldn’t meet expectations', message: 'The server couldn’t live up to what your request expected of it. Lower the bar slightly.' },
  // { code: 418, phrase: "I'm a Teapot", title: 'Refusing to brew coffee', message: 'The server is, permanently and proudly, a teapot. It will not brew you coffee.' },
  // { code: 421, phrase: 'Misdirected Request', title: 'Wrong server, sorry', message: 'Your request reached a server that can’t answer for it.' },
  // { code: 422, phrase: 'Unprocessable Content', title: 'Looks right, makes no sense', message: 'Your request was well-formed, but its instructions don’t add up.' },
  // { code: 423, phrase: 'Locked', title: 'Someone else got here first', message: 'The thing you’re after is locked. It isn’t going anywhere until someone unlocks it.' },
  // { code: 425, phrase: 'Too Early', title: 'Too early', message: 'The server isn’t willing to gamble on such an early request.' },
  // { code: 426, phrase: 'Upgrade Required', title: 'Time to level up', message: 'You’ll need to switch to a newer protocol before the server continues this conversation.' },
  // { code: 428, phrase: 'Precondition Required', title: 'Needs some conditions', message: 'The server needs conditions attached before it takes this request seriously.' },
  // { code: 429, phrase: 'Too Many Requests', title: 'Slow down', message: 'Too many requests, too fast.' },
  // { code: 431, phrase: 'Request Header Fields Too Large', title: 'Your headers are overweight', message: 'Your browser sent more header data than the server will carry. Clear cookies and try again.' },
  // { code: 451, phrase: 'Unavailable For Legal Reasons', title: '1984 is calling', message: 'Censored or restricted by order of a legal authority or copyright notice.' },
  { code: 500, phrase: 'Internal Server Error', title: 'We tripped over ourselves', message: 'Something broke on our side. it’s not you.' },
  // { code: 501, phrase: 'Not Implemented', title: 'Nobody built that yet', message: 'The server doesn’t know how to do that.' },
  { code: 502, phrase: 'Bad Gateway', title: 'Upstream said something weird', message: 'A server in the chain returned garbage so there’s nothing good to show you right now.' },
  { code: 503, phrase: 'Service Unavailable', title: 'Taking a quick nap', message: 'We are down for maintenance or drowning in traffic. It\'ll be back shortly. Probably.' },
  { code: 504, phrase: 'Gateway Timeout', title: 'Nobody picked up', message: 'The gateway called the origin and got silence. The timeout rang first.'},
  // { code: 505, phrase: 'HTTP Version Not Supported', title: 'Version mismatch', message: 'The protocol version you spoke isn\'t supported here. Time to negotiate down. ..or up.' },
  // { code: 506, phrase: 'Variant Also Negotiates', title: 'Negotiated in circles', message: 'The server got tangled negotiating variants with itself.' },
  // { code: 507, phrase: 'Insufficient Storage', title: 'Completely out of room', message: 'The server has no space left to store that. Something needs deleting before this can proceed.' },
  // { code: 508, phrase: 'Loop Detected', title: 'Caught in a loop', message: 'The servers detected an infinite loop and stepped away.' },
  // { code: 510, phrase: 'Not Extended', title: 'Needs extensions we lack', message: 'This request needs extensions the server doesn’t have.' },
  // { code: 511, phrase: 'Network Authentication Required', title: 'This Wi-Fi wants a login', message: 'The network you’re on wants you to log in first. look for a captive portal or sign-in page.' },
  { code: 520, phrase: 'Web Server Returned an Unknown Error', title: 'Origin said… something', message: 'The origin server returned an unexpected response that the gateway couldn\'t understand or parse.' },
  { code: 521, phrase: 'Web Server Is Down', title: 'Origin is unreachable', message: 'The origin server refused the connection. It may be offline, overloaded, or blocking the gateway.' },
  { code: 522, phrase: 'Connection Timed Out', title: 'Origin went silent', message: 'The gateway reached out to the origin, but it never answered. The TCP handshake timed out.' },
  { code: 523, phrase: 'Origin Is Unreachable', title: 'Can\'t find the origin', message: 'The gateway couldn\'t route to the origin server at all. DNS failure, network issue, or misconfiguration.' },
]

export const ERROR_CODES = HTTP_ERRORS.map((error) => error.code)
