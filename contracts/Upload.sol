//SPDX-License-Identifier:MIT
pragma solidity >=0.7.0 <0.9.0;

contract Upload {
    mapping(address => string[]) value;

    function add(address _user, string calldata url) external {
        require(msg.sender == _user, "Only the user can add their images");
        value[_user].push(url);
    }

    // function remove(address _user, string memory url) external {
    function remove(address _user, string calldata url) external {
        require(msg.sender == _user, "Only the user can remove their images");
        string[] storage urls = value[_user];
        bool found = false;

        for (uint i = 0; i < urls.length; i++) {
            if (keccak256(bytes(urls[i])) == keccak256(bytes(url))) {
                urls[i] = urls[urls.length - 1]; // Move last element to the deleted spot
                urls.pop(); // Remove last element
                found = true;
                break;
            }
        }

        require(found, "Image Id not found");
    }

    function display(address _user) external view returns (string[] memory) {
        require(_user == msg.sender, "You don't have Access");
        return value[_user];
    }
}
