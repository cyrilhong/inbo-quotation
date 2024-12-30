import React from 'react';
import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import { colors, mediaQueries } from '../variables';
import Cart from '../img/cart.svg'
const Product = (props) => {
  const { listView, imageUrl, titleZh, titleEng, desc, product_price_tiers, userMemberTier, memberTier } = props;
  const NoMemberInfo = () => {
    // const lowestTier = memberTier.reduce((prev, curr) => (prev.level < curr.level ? prev : curr));
    // return lowestTier.name_translations['zh-hant'];
    return '一般會員';
  }
  return (
    <Wrapper listView={listView} className={listView ? '' : 'grid'}>
      {/* nation: {JSON.stringify(props.props.nation)} <br />
      processing: {JSON.stringify(props.props.processing)} */}
      <div className="info">
        <div className="cover">
          <img src={imageUrl} alt="Product" />
        </div>
        <div className="title-section">
          <div className="title-wrapper">
            <div className="second-level-wrapper">
              <div className="title-zh">{titleZh}</div>
              <div className="title-eng">{titleEng}</div>
            </div>
            {/* {JSON.stringify(props.props.link)} */}
            <div className="purchase">
              <Button
                variant="contained"
                onClick={() => {
                  window.open(`${process.env.REACT_APP_API_URL}${props.props.link}`, '_blank'); // Replace with your desired URL 
                }}
              >
                <img src={Cart} alt="Cart" />
              </Button>
            </div>
          </div>
          <div className="desc">
            {desc}
          </div>
          <div className="purchase">
            <Button
              variant="contained"
              onClick={() => {
                window.open(`${process.env.REACT_APP_API_URL}${props.props.link}`, '_blank'); // Replace with your desired URL 
              }}
            >
              <img
                src={Cart}
                alt="Cart"
              />
            </Button>
          </div>
        </div>
      </div>
      <div className="price-section">
        <div className="main-price">
          <div className="title">定價</div>
          <div className="list">
            {product_price_tiers
              .filter(item => item.membership_tier_id === '62ea8eb9f7493500173c7959' && item?.variation_details?.quantity > 0)
              .sort((a, b) => (a.variation_details.weight || 0) - (b.variation_details.weight || 0)) // Sort by weight
              .map(item => (
                <div className="tier" key={item._id}>
                  <div className="price-tag">NT$ {item.member_price.avg_price}/kg</div>
                  <div className="package">{item?.variation_details.fields_translations?.['zh-hant']}</div>
                </div>
              ))}

          </div>
        </div>
        <div className="member-price">
          <div className="title">{userMemberTier ? userMemberTier.name_translations?.['zh-hant'] : NoMemberInfo()}</div>
          <div className="list">
            {product_price_tiers
              .filter(item => item.membership_tier_id === (userMemberTier ? userMemberTier.id : '62ea8eb9f7493500173c7959')
                && item?.variation_details?.quantity > 0
              )
              .sort((a, b) => (a.variation_details?.weight || 0) - (b.variation_details?.weight || 0)) // Sort by weight
              .map(item =>
              (
                <div className="tier" key={item._id}>
                  {/* {JSON.stringify(item)} */}
                  <div className="price-tag">NT$ {item.member_price.avg_price}/kg</div>
                  <div className="package">{item?.variation_details?.fields_translations?.['zh-hant']}：{item.member_price.label}</div>
                  {/* <div className="purchase">
                    <ShoplineButtonFrame variationId={item.variation_key} productID={item.product_id} />
                  </div> */}
                </div>
              ))}

          </div>
        </div>
      </div>
      <div className="listview-purchase">
        <Button
          variant="contained"
          onClick={() => {
            window.open(`${process.env.REACT_APP_API_URL}${props.props.link}`, '_blank'); // Replace with your desired URL 
          }}
        >
          <img src={Cart} alt="Cart" />
        </Button>
      </div>
    </Wrapper>
  );
};

export default Product;

const Wrapper = styled.div`
  padding: 16px;
  background-color: ${colors.gray};
  /* border: 1px solid #000; */
  display: flex;
  flex-direction: row;
  gap:20px;
  width: 100%;
  .info{
    display: flex;
    flex: 1;
    flex-direction: ${props => props.listView ? 'column' : 'row'};
    gap: 12px;
    .cover{
      display: ${props => props.listView ? 'none' : 'block'};
      img{
        width: 200px;
        display: flex;
        height: 200px;
        object-fit: cover;
      }
    }
    text-align: left;
  }
  .title-section{
    display: flex;
    flex: 1;
    flex-direction: column;
    position: relative;
    .title-wrapper{
      height: ${props => props.listView ? '73px' : 'auto'};  
      margin-bottom: ${props => props.listView ? '12px' : '0px'}; 
      display: flex;
      flex-direction: column;
      border-bottom: 1px solid ${colors.lightGray};
      .purchase{
        display: none;
      }
      .second-level-wrapper{
        display: flex;
        flex-direction: column;
      }
    }
    .title-zh{
      font-size: 16px;
      font-weight: 700;
    }
    .title-eng{
      font-size: 16px;
      font-weight: 700;
    }
    .purchase{
      display: ${props => props.listView ? 'none' : 'block'}; 
      width: 100%;
      position: absolute;
      bottom: 0;
      button{
        width: 100%;
        height: 24px;
        background-color: ${colors.cta}!important;
        img{
          height: 16px;
        }
      }

    }
  }
  .desc{
    font-size: 12px;
  }
  .price-section{
    display: flex;
    flex: 1;
    flex-direction: column;
    .title{
      font-size: 14px;
    }
    .main-price{
      text-align: left;
      display: flex;
      flex-direction: column;
      border-bottom: 1px solid ${colors.lightGray};
      padding-bottom: 12px;
      font-size: 12px;
      gap: 6px;
      .title{
        font-weight: bold;
        font-size: 14px;
      }
    }
    .member-price{
      display: flex;
      text-align: left;
      flex-direction: column;
      padding-top: 12px;
      gap: 6px;
      .title{
        font-weight: bold;
        font-size: 14px;
      }
      .price-tag{
        font-size: 14px;
        color: ${colors.cta};
      }
      .package{
        font-size: 12px;
      }
    }
    .list{
      display: flex;
      flex-direction: row;
    }
    .tier{
      display: flex;
      flex: 1;
      flex-direction: column;
      margin-right: 8px;
      text-align: left;
      .price-tag{
        font-weight: bold;
      }
      .title{
        font-size: 12px;
      }
      .price-eng{
        font-size: 16px;
        font-weight: 700;
      }
    }
  }
  .listview-purchase{
    display: ${props => props.listView ? 'flex' : 'none'};
    align-items: end;
    button{
      height: 40px;
      background-color: ${colors.cta}!important;
    }
  }
  &.grid{
    flex-direction: column;
    gap: 12px;
    .info{
      padding-bottom: 12px;
      border-bottom: 1px solid ${colors.lightGray};
    }
    .title-section{
      .title-zh{
        font-size: 12px;
      }
      .title-eng{
        font-size: 10px;
      }
      .desc{
        font-size: 10px;
      }
    }
    .price-section{
      .main-price{
        gap: 12px;
        .title{
          width: 20px;
          font-size: 10px;
        }
        flex-direction: row;
        .list{
          flex: 1;
        }
      }
      .member-price{
        flex-direction: row;
        gap: 12px;
        .title{
          width: 20px;
          font-size: 10px;
        }
        .list{
          flex: 1;
          .tier{
            .price-tag{
              font-size: 14px;
            }
            .package{
              font-size: 10px;
            }
          }
        }
      }
    }
    .list{
      .tier{
        .price-tag{
          font-size: 10px;
        }
        .package{
          font-size: 10px;
        }
      }
    }
  }
  ${mediaQueries.tablet}{
    flex-direction: column;
    gap: 6px;
    .title-section{
      .title-wrapper{
          height: auto;
          border-bottom: 0;
          flex-direction: row;
          margin-bottom: 6px;
          gap: 6px;
        .second-level-wrapper{
          width: 100%;
          .title-zh{
            font-size:12px;
          }
          .title-eng{
            font-size:10px;
          }
        }
        .purchase{
          display: block;
          position: relative;
          width: 40px;
          button{
            min-width: initial;
          }
        }
      }
      .desc{
        font-size:10px;
      }
    }
    .purchase{
      display: none;
    }
    .listview-purchase{
      display: none;
    }
    .price-section{
      .main-price{
        gap: 0;
        border-bottom: 0;
        padding-bottom: 0;
        .title{
          font-size: 10px;
        }
        .list{
          .tier{
            .price-tag{
              font-size: 10px;
            }
            .package{
              font-size: 10px;
            }
          }
        }
      }
      .member-price{
        gap: 0;
        padding-top: 6px;
        .title{
          font-size: 10px;
        }
        .list{
          .tier{
            .price-tag{
              font-size: 14px;
            }
            .package{
              font-size: 10px;
            }
          }
        }
      }
    }
    &.grid{
      .title-section{
        .title-wrapper{
          .purchase{
            display: none;
          }
        }
      }
    }
  }
`;