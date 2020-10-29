import React from "react";
import styled from "styled-components";
import _ from "lodash";

export const FindDealersLink = ({ text, onClick, theme }) => {
  return (
    <FindDealersLinkWrapper onClick={onClick} theme={theme}>
      {text}
    </FindDealersLinkWrapper>
  );
};

const DealerModal = ({
  open,
  toggleModal,
  closeModalButton,
  theme,
  dealers,
  text,
}) => {
  return (
    <>
      <ModalBlur open={open} onClick={toggleModal} />
      <ModalWrapper open={open}>
        <Modal theme={theme}>
          <CloseButtonWrapper onClick={toggleModal}>
            {closeModalButton}
          </CloseButtonWrapper>
          <ModalInner>
            <ModalHeader>{text}</ModalHeader>
            <DealerList>
              {_.map(dealers, (dealer) => (
                <a
                  href={_.get(dealer, "data.dealer_homepage.url", "#")}
                  target="_blank"
                  rel="noreferrer noopener"
                  key={dealer.uid}
                >
                  <DealerListRow>
                    <DealerLogo
                      theme={theme}
                      src={_.get(dealer, "data.dealer_logo.url", "")}
                      alt={_.get(dealer, "data.dealer_logo.alt", "")}
                    />
                  </DealerListRow>
                </a>
              ))}
            </DealerList>
          </ModalInner>
        </Modal>
      </ModalWrapper>
    </>
  );
};

const ModalInner = styled.div``;

const ModalHeader = styled.h4`
  font-weight: bold;
  margin-top: 3rem;
  margin-left: 2rem;
`;

const DealerList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 2rem 2rem;
`;

const DealerListRow = styled.li`
  margin: 2rem 0;
`;

const DealerLogo = styled.img`
  max-width: 350px;
  max-height: 200px;

  @media screen and (max-width: ${(props) =>
      props.theme.sideBySideLayoutBreakpoint}) {
    max-width: 90%;
  }
`;

const Modal = styled.div`
  position: absolute;
  z-index: 999;
  background: white;
  box-shadow: 0 10px 20px 5px rgba(0, 0, 0, 0.2);
  width: 800px;
  align-self: center;

  @media screen and (max-width: ${(props) =>
      props.theme.sideBySideLayoutBreakpoint}) {
    width: 100%;
    margin: 2rem 1rem auto 1rem;
  }
  @media screen and (min-width: ${(props) =>
      props.theme.sideBySideLayoutBreakpoint}) {
    top: 0.25rem;
  }
`;

const ModalBlur = styled.div`
  display: ${(props) => (props.open ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.4);
  z-index: 998;
  justify-content: center;
`;

const FindDealersLinkWrapper = styled.div`
  display: inline-block;
  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: ${(props) =>
      props.theme.sideBySideLayoutBreakpoint}) {
    display: block;
    text-align: center;
  }
`;

const CloseButtonWrapper = styled.div`
  position: relative;
  display: inline-block;
  top: 20px;
  left: calc(100% - 40px);
`;

const ModalWrapper = styled.div`
  display: ${(props) => (props.open ? "flex" : "none")};
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
`;

export default DealerModal;
