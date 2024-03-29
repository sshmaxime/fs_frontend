import React from "react";
import styled from "styled-components";
import { RightArrowAlt } from "styled-icons/boxicons-regular/RightArrowAlt";

const StyledInputContainer = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
	width: 100%;
	border-radius: 2px;
	padding: 0.8rem
	background: rgba(57, 63, 84, 0.8);
	box-sizing: border-box;

	input {
		flex-grow: 1;
		color: ${props => props.theme.text};
		font-size: 1.4rem;
		line-height: 2.4rem;
		vertical-align: middle;
		&::-webkit-input-placeholder {
			color: ${props => props.theme.textAccent};
		}
	}
`;

const StyledArrow = styled(RightArrowAlt)`
	color: ${props => props.theme.textAccent};
	height: 2rem;
	vertical-align: middle;
	transition: color 0.25s;
	&:hover {
		cursor: pointer;
		color: ${props => props.theme.text};
	}
`;

export default class SingleFieldForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { value: "" };
	}
	render() {
		return (
			<StyledInputContainer>
				<input
					placeholder={this.props.placeholder}
					onChange={e => this.setState({ value: e.target.value })}
				/>
				<button onClick={() => this.props.onSubmit(this.state.value)}>
					<StyledArrow />
				</button>
			</StyledInputContainer>
		);
	}
}
