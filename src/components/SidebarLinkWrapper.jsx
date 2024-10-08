import styled from "styled-components";

export const SidebarLinkWrapper = styled.div`
	a {
		
      text-decoration: none;
      padding: 10px;
      display: flex;
      flex-direction: column;
      color: #1e3a8a;

      &.active {
        font-weight: bold;
      }
      &:hover {
        background: #eff6ff;
        border-radius: 4px;
      }
	}
`
