import React from "react";
import styled from "styled-components";
import { RightArrowAlt } from "styled-icons/boxicons-regular/RightArrowAlt";

const StyledInputContainer = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
	width: 100%;
	max-width: 300px;
	border-radius: 2px;
	padding: 1rem 1rem 1rem 1.5rem;
	background: rgba(57, 63, 84, 0.8);
	&:after {
		content: "";
		position: absolute;
		left: 0px;
		right: 0px;
		bottom: 0px;
		z-index: 999;
		height: 0.5rem;
		border-bottom-left-radius: 2px;
		border-bottom-right-radius: 2px;
		background-position: 0% 0%;
		background: linear-gradient(
			to right,
			#b294ff,
			#57e6e6,
			#feffb8,
			#57e6e6,
			#b294ff,
			#57e6e6
		);
		background-size: 500% auto;
		animation: gradient 3s linear infinite;
	}

	input {
		flex-grow: 1;
		color: #bfd2ff;
		font-size: 1.4rem;
		line-height: 2.4rem;
		vertical-align: middle;
		&::-webkit-input-placeholder {
			color: #7881a1;
		}
	}
`;

const StyledArrow = styled(RightArrowAlt)`
	color: #7881a1;
	height: 2rem;
	vertical-align: middle;
	transition: color 0.25s;
	&:hover {
		cursor: pointer;
		color: #bfd2ff;
	}
`;

const Input = () => {
	return (
		<StyledInputContainer>
			<input placeholder="Enter a room code" />
			<button>
				<StyledArrow />
			</button>
		</StyledInputContainer>
	);
};

export default Input;