import { FC } from 'react'

interface Props {
  width?: number
}

export const LoadingSpinner: FC<Props> = ({ width = 22 }) => {
  return (
    <svg
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={width}
      height={width}
      viewBox="0 0 399.389 399.389"
    >
      <g>
        <path
          className="fill-white"
          d="M340.896,58.489C303.18,20.773,253.031,0.001,199.693,0.001c-53.34,0-103.487,20.771-141.204,58.488
		C20.772,96.207,0,146.355,0,199.694c0,53.34,20.772,103.489,58.49,141.206c37.717,37.717,87.864,58.488,141.204,58.488
		c53.339,0,103.486-20.771,141.205-58.488c37.717-37.717,58.49-87.865,58.49-141.206C399.387,146.355,378.613,96.207,340.896,58.489
		z M328.061,71.326c34.289,34.289,53.172,79.878,53.172,128.368h-41.148c0-77.412-62.979-140.391-140.391-140.391
		c-4.593,0-9.134,0.229-13.615,0.662v-41.31c4.508-0.332,9.049-0.5,13.615-0.5C248.184,18.155,293.771,37.038,328.061,71.326z
		 M199.693,321.931c-67.401,0-122.236-54.835-122.236-122.236S132.292,77.458,199.693,77.458S321.93,132.293,321.93,199.694
		S267.094,321.931,199.693,321.931z"
        />
      </g>
    </svg>
  )
}
