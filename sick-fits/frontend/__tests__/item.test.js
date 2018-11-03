import ItemComponent from "../components/Item";
import { shallow } from "enzyme";
const fakeItem = {
  id: "asdf1234",
  title: "fake Item",
  price: 500,
  description: "this is a fake item",
  image: "photo.jpg",
  largeImage: "largePhoto.jpg"
};

describe("<Item/>", () => {
  // it("renders and displays properly", () => {
  //   const wrapper = shallow(<ItemComponent item={fakeItem} />);
  //   const PriceTag = wrapper.find("PriceTag");
  //   console.log(PriceTag.children());
  //   expect(PriceTag.children().text()).toBe("$5");
  //   console.log(wrapper.debug());
  //   expect(wrapper.find("Title a").text()).toBe(fakeItem.title);
  //   const image = wrapper.find("img");
  //   expect(image.props().src).toBe(fakeItem.image);
  //   expect(image.props().alt).toBe(fakeItem.title);
  // });
  // it("renders out the buttons properly", () => {
  //   const wrapper = shallow(<ItemComponent item={fakeItem} />);
  //   const ButtonList = wrapper.find(".buttonList");
  //   expect(ButtonList.children()).toHaveLength(3);
  //   expect(ButtonList.find("Link")).toHaveLength(1);
  //   expect(ButtonList.find("Link").exists()).toBe(true);
  // });
});
