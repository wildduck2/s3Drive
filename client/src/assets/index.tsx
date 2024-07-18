import { HtmlHTMLAttributes } from 'react'

export interface IconType extends HtmlHTMLAttributes<SVGElement> {}

export const Icon = {
  trash2: ({ className }: IconType) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line
        x1="10"
        x2="10"
        y1="11"
        y2="17"
      />
      <line
        x1="14"
        x2="14"
        y1="11"
        y2="17"
      />
    </svg>
  ),

  upload: ({ className }: IconType) => (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      height="200px"
      width="200px"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line
        x1="12"
        y1="3"
        x2="12"
        y2="15"
      ></line>
    </svg>
  ),
  X: ({ className }: IconType) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  ),

  iconBackground: ({ className }: IconType) => (
    <svg
      width="128"
      height="128"
      viewBox="0 0 128 128"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_2_7030)">
        <path
          d="M121.863 19.6655L104.49 1.7625L92.7852 0H73.7812L57.1877 19.851L57.6267 115.781L73.781 128H118.272C121.03 128 123.265 125.765 123.265 123.009V31.1542L121.863 19.6655Z"
          fill="#CED9F9"
        />
        <path
          d="M112.91 22.237H103.602C102.489 22.237 101.587 21.3355 101.587 20.2232V10.353C101.587 5.1305 97.7747 0.80125 92.7852 0H99.4922C112.622 0 123.265 10.6388 123.265 23.7625V31.1542C122.508 26.1073 118.161 22.237 112.91 22.237Z"
          fill="#B6C6F7"
        />
        <path
          d="M29.577 0H73.781V128H29.577C26.8195 128 24.584 125.765 24.584 123.009V4.99075C24.584 2.2345 26.8195 0 29.577 0Z"
          fill="#E7ECFC"
        />
        <path
          d="M8.74724 42.059C6.53124 42.059 4.73474 43.8555 4.73474 46.0715V92.1035C4.73474 94.3195 6.53124 96.116 8.74724 96.116H54.372L60.4825 92.7318V45.8787L54.372 42.059H8.74724Z"
          fill="#3B67E9"
        />
        <path
          d="M104.01 92.1035V46.0715C104.01 43.8552 102.213 42.059 99.997 42.059H54.372V96.1162H99.9968C102.213 96.116 104.01 94.3195 104.01 92.1035Z"
          fill="#2354E6"
        />
      </g>
      <defs>
        <clipPath id="clip0_2_7030">
          <rect
            width="128"
            height="128"
            fill="white"
          />
        </clipPath>
      </defs>
    </svg>
  ),
}
