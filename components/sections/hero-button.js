import { styled } from "@mui/material"
import Link from "../elements/link"

export default function HeroButton({ data }) {
  return (
    <Wrapper>
      <DecorativeLine />
      <Link to={data.href} underline="none">
        <Button>{data.text}</Button>
      </Link>
    </Wrapper>
  )
}

const Wrapper = styled("div")`
  margin: 6rem auto;
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  overflow-x: hidden;

  @media (max-width: 1260px) {
    margin: 2rem auto;
  }

  @media (max-width: 768px) {
    margin: 0rem auto 1rem auto;
  }
`

const Button = styled("div")`
  margin: 1rem 0;
  padding: 1.5rem 2rem;
  font-size: 1.5rem;
  color: white;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0;
  background-color: #4d2862;
  transition: box-shadow 0.3s ease-in-out;
  transition: background-color 0.3s ease-in-out;

  a > & {
    transition: box-shadow 0.3s ease-in-out;
    background-color: #4d2862;
  }

  a:hover > & {
    box-shadow: 0px 0px 10px 0px #1c0f24ba;
    background-color: #713b90;
  }

  @media (max-width: 1260px) {
    padding: 1.25rem 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 1rem 1.25rem;
    font-size: 1.25rem;
  }
`

const DecorativeLine = styled("div")`
  z-index: -1000;
  position: absolute;
  background-color: #4d2862;
  top: 50%;
  left: -5000px;
  width: 10000px;
  height: 1px;
`
