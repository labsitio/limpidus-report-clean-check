import { createGlobalStyle } from 'styled-components';
import media from 'styled-media-query';
import colors from './colors';

interface GlobalProps {
  fontSize: number;
}

export default createGlobalStyle<GlobalProps>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
  }

  body {
    background: ${colors.white};
    color: ${colors.gray};
    -webkit-font-smoothing: antialiased;
  }

  body, html, input, button {
    font-family: 'Hind', sans-serif;
    font-size: ${props => props.fontSize}px;
  }



  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 500;
  }

  button {
    cursor: pointer;
  }
  .react-datepicker{
    right: 25px;
    z-index: 99999;
  }
`;
