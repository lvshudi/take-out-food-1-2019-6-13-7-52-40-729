function bestCharge(selectedItems) {
  let itemsInfo = changeOrderToItems(selectedItems);
  let priceAndRules = calculatePrice(itemsInfo);
  let result = resultFormat(priceAndRules, itemsInfo);
  return result;
}

function changeOrderToItems(selectedItems) {
  let itemsInfo = [];
  let items = loadAllItems();
  for (let index = 0; index < selectedItems.length; index++) {
    //设定返回值
    let itemInfo = {};
    //从入参中筛选出id和参数
    let selectedItem = selectedItems[index];
    let selectedItemInfo = selectedItem.split(" ");
    let itemId = selectedItemInfo[0];
    //数量
    itemInfo.count = selectedItemInfo[2];

    for (let index = 0; index < selectedItem.length; index++) {
      let item = items[index];
      if (itemId === item.id) {
        itemInfo.name = item.name;
        itemInfo.price = item.price * itemInfo.count;
        itemInfo.id = itemId;
        itemsInfo.push(itemInfo);
        break;
      }
    }
  }
  return itemsInfo;
}

function calculatePrice(itemsInfo) {
  let flag = 0;
  let enoughPrice = 0;
  let discountPrice = 0;
  let discounted = 0;
  itemsInfo.forEach(itemInfo => {
    enoughPrice += itemInfo.price;
    if (enoughPrice >= 30) {
      enoughPrice -= 6;
      flag = 1;
    }
  });


  let discountType = loadPromotions();
  let discountItems = discountType[1].items;
  itemsInfo.forEach(itemInfo => {
    discountItems.forEach(discountItem => {
      if (discountItem == itemInfo.id) {
        itemInfo.price = itemInfo.price/2;
        discounted += itemInfo.price;
        flag = 1;
      }
    });
    discountPrice += itemInfo.price;
  });

  if(flag!=0) {
    if(enoughPrice > discountPrice) {
      return [discountPrice, "指定菜品半价(黄焖鸡，凉皮)，省"+discounted+"元"];
    } else if (enoughPrice <= discountPrice) {
      return [enoughPrice, "满30减6元，省6元"];
    } 
  } else {
    return [enoughPrice, ""];
  }
  
}

function resultFormat(priceAndRules, itemsInfo) {
  let result = "============= 订餐明细 =============\n";
  itemsInfo.forEach(itemInfo => {
    result += itemInfo.name + " X " + itemInfo.count + " = " + itemInfo.price + "元\n";
  });
  result += "-----------------------------------\n使用优惠:\n" + priceAndRules[1] +
            "\n-----------------------------------\n总计：" + priceAndRules[0] +"元\n===================================";
  return result;
}
