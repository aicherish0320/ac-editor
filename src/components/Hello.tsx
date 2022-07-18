interface Props {
  msg: string
}

const Hello = (props: Props) => {
  return <h1>Hello-{props.msg}</h1>
}

export default Hello
