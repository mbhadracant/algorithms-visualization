import React, { forwardRef } from 'react';
import styled from "styled-components";

const Label = styled.span`
    color: white;
    letter-spacing: 1px;
    display: flex;
    justify-content: center;
    align-items: center;
`;


const InputField = styled.div`
    margin: 10px;
    display: flex;
    flex-direction: row;
`;

const Input = styled.input`
    width:100px;
    border: 0;
    outline: 0;
    padding: 10px 0;
    border-bottom: 2px solid white;
    margin-left:10px;
    box-shadow: none;
    color: #111;
    background:none;
    color: white;
    letter-spacing: 1px;
    margin-top:5px;
`;

interface NumberInputProps {
    label: string,
    ref: React.RefObject<HTMLInputElement>,
    placeholder: string
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
    ({label, placeholder}, ref) => (
        <InputField>
            <Label>{label}</Label>
            <Input ref={ref} placeholder={placeholder} type="number"/>
        </InputField>
    )
  );

export default NumberInput;