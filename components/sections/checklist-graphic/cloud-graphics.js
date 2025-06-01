import { ArrowForward } from "@mui/icons-material"
import { Button, styled } from "@mui/material"
import Link from "next/link"

export const CloudsGroup = ({ text, href, buttonText }) => {
  return (
    <Wrapper>
      <PurpleCloud
        style={{
          zIndex: 1,
          fontSize: "1.5rem",
          textAlign: "center",
        }}
      >
        {text}
        <Link href={href} passHref>
          <LightPurpleButton
            component={"a"}
            endIcon={<ArrowForward />}
            sx={{
              position: "absolute",
              bottom: 0,
              transform: "translateY(50%)",
            }}
          >
            {buttonText}
          </LightPurpleButton>
        </Link>
      </PurpleCloud>
      <LightPurpleCloud
        style={{
          position: "absolute",
          top: "-30px",
          left: "-100px",
          zIndex: 0,
        }}
      />
    </Wrapper>
  )
}

const Wrapper = styled("div")`
  position: absolute;
  right: 0px;
  top: 50px;
  isolation: isolate;
  transform-origin: top right;

  @media (max-width: 1260px) {
    scale: 0.6;
  }

  @media (max-width: 768px) {
    display: none;
  }
`

const LightPurpleCloud = ({ style }) => {
  return (
    <svg
      style={style}
      width="217"
      height="140"
      viewBox="0 0 217 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M93.458 12C116.556 12 136.465 25.6552 145.553 45.333C150.038 42.6839 155.268 41.1622 160.854 41.1621C176.724 41.1621 189.728 53.4286 190.902 68.9971C203.323 72.7185 212.374 84.2347 212.374 97.8662C212.374 114.4 199.058 127.821 182.564 127.995V128H35.458V127.995C35.3502 127.996 35.2419 128 35.1338 128C18.4914 128 5.00016 114.509 5 97.8662C5 81.2237 18.4913 67.7316 35.1338 67.7314C35.4664 67.7314 35.7979 67.7383 36.1279 67.749C36.9768 36.8156 62.3195 12.0001 93.458 12Z"
        fill="#D4C9D8"
      />
    </svg>
  )
}

const PurpleCloud = ({ style, children }) => {
  return (
    <div style={{ position: "relative", display: "inline-block", ...style }}>
      <svg
        width="330"
        height="250"
        viewBox="0 0 330 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M214.5 212C223.06 212 230 218.94 230 227.5C230 236.06 223.06 243 214.5 243C205.94 243 199 236.06 199 227.5C199 218.94 205.94 212 214.5 212ZM141.5 12C177.143 12 207.863 33.0716 221.887 63.4365C228.808 59.3483 236.879 57 245.5 57C269.988 57 290.054 75.929 291.866 99.9531C311.032 105.696 325 123.465 325 144.5C325 167.676 308.044 186.889 285.86 190.417C284.392 205.893 271.361 218 255.5 218C239.839 218 226.937 206.196 225.201 191H52V190.996C51.8335 190.998 51.6669 191 51.5 191C25.8188 191 5 170.181 5 144.5C5 118.819 25.8188 98 51.5 98C52.0137 98 52.5255 98.0089 53.0352 98.0254C54.3457 50.2924 93.4504 12 141.5 12Z"
          fill="#522664"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: "60px 40px",
          padding: "1rem",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </div>
    </div>
  )
}

const LightPurpleButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#d2c9d7",
  "&:hover": {
    backgroundColor: "#bfafc8",
  },
}))
