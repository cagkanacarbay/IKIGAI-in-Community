interface IconProps {
  iconName: string;
  size?: number;
}

const Icon: React.FC<IconProps> = ({ iconName, size }) => {

  const sizeString = size ? size.toString() : '24';

  switch (iconName) {
    case "image":
      return (
        <svg width={sizeString} height={sizeString} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2.67 18.9501L7.6 15.6401C8.39 15.1101 9.53 15.1701 10.24 15.7801L10.57 16.0701C11.35 16.7401 12.61 16.7401 13.39 16.0701L17.55 12.5001C18.33 11.8301 19.59 11.8301 20.37 12.5001L22 13.9001" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "image-delete":
      return (
        <svg width={sizeString} height={sizeString} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M13 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V10" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16.5601 6.94L20.4401 3.06" stroke="#292D32" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M20.4401 6.94L16.5601 3.06" stroke="#292D32" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M2.66992 18.95L7.59992 15.64C8.38992 15.11 9.52992 15.17 10.2399 15.78L10.5699 16.07C11.3499 16.74 12.6099 16.74 13.3899 16.07L17.5499 12.5C18.3299 11.83 19.5899 11.83 20.3699 12.5L21.9999 13.9" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      );
    case "image-replace":
      return (
        <svg width={sizeString} height={sizeString} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M13 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V10" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M19.1399 2.59003L15.5099 6.22003C15.3699 6.36003 15.2299 6.63003 15.2099 6.83003L15.0099 8.22003C14.9399 8.72003 15.2899 9.07003 15.7899 9.00003L17.1799 8.80003C17.3699 8.77003 17.6499 8.64003 17.7899 8.50003L21.4199 4.87003C22.0499 4.24003 22.3399 3.52003 21.4199 2.60003C20.4899 1.66003 19.7699 1.96003 19.1399 2.59003Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M18.6201 3.10999C18.9301 4.20999 19.7901 5.06999 20.8901 5.37999" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2.66992 18.95L7.59992 15.64C8.38992 15.11 9.52992 15.17 10.2399 15.78L10.5699 16.07C11.3499 16.74 12.6099 16.74 13.3899 16.07L17.5499 12.5C18.3299 11.83 19.5899 11.83 20.3699 12.5L21.9999 13.9" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      );
    case "tag":
      return (
        <svg width={sizeString} height={sizeString} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 3L8 21" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 3L14 21" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3.5 9H21.5" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2.5 15H20.5" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "drag&drop":
      return (
        <svg width={sizeString} height={sizeString} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_9_9276)">
            <path d="M16 13L22.964 17.062L19.991 17.912L22.116 21.593L20.384 22.593L18.259 18.913L16.036 21.063L16 13ZM14 6H16V8H21C21.2652 8 21.5196 8.10536 21.7071 8.29289C21.8946 8.48043 22 8.73478 22 9V13H20V10H10V20H14V22H9C8.73478 22 8.48043 21.8946 8.29289 21.7071C8.10536 21.5196 8 21.2652 8 21V16H6V14H8V9C8 8.73478 8.10536 8.48043 8.29289 8.29289C8.48043 8.10536 8.73478 8 9 8H14V6ZM4 14V16H2V14H4ZM4 10V12H2V10H4ZM4 6V8H2V6H4ZM4 2V4H2V2H4ZM8 2V4H6V2H8ZM12 2V4H10V2H12ZM16 2V4H14V2H16Z" fill="black"/>
          </g>
          <defs>
            <clipPath id="clip0_9_9276">
            <rect width="24" height="24" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      );
    case 'revisit':
      return (
        <svg width={sizeString} height={sizeString} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 3L16.44 5.34003L8.48999 5.32001C4.91999 5.32001 1.98999 8.25003 1.98999 11.84C1.98999 13.63 2.71998 15.26 3.89998 16.44" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.0001 21L7.56006 18.66L15.5101 18.68C19.0801 18.68 22.0101 15.75 22.0101 12.16C22.0101 10.37 21.2801 8.74 20.1001 7.56" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12H15" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'eraser':
      return (
        <svg width={sizeString} height={sizeString} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 22H21" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2.90997 17.58L6.41998 21.09C7.58998 22.26 9.49997 22.26 10.66 21.09L21.09 10.66C22.26 9.48997 22.26 7.57997 21.09 6.41997L17.58 2.90997C16.41 1.73997 14.5 1.73997 13.34 2.90997L2.90997 13.34C1.73997 14.5 1.73997 16.41 2.90997 17.58Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M7.12 9.13L14.87 16.88" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3.52002 17.66L9.16998 12" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6.34003 20.49L12 14.83" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      );
    case 'edit':
      return (
      <svg width={sizeString} height={sizeString} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16.04 3.02001L8.16 10.9C7.86 11.2 7.56 11.79 7.5 12.22L7.07 15.23C6.91 16.32 7.68 17.08 8.77 16.93L11.78 16.5C12.2 16.44 12.79 16.14 13.1 15.84L20.98 7.96001C22.34 6.60001 22.98 5.02001 20.98 3.02001C18.98 1.02001 17.4 1.66001 16.04 3.02001Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14.91 4.15002C15.58 6.54002 17.45 8.41002 19.85 9.09002" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      );
    case 'close':
      return (
        <svg width={sizeString} height={sizeString} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9.17 14.83L14.83 9.17" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M14.83 14.83L9.17 9.17" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      );
    case 'maximize':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M18 6L6 18" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M18 10V6H14" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 14V18H10" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 6L18 18" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 10V6H10" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M18 14V18H14" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      );
  default:
      return null;
  }
};

export default Icon;
