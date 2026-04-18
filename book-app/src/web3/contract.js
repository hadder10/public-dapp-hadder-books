import { ethers } from "ethers";

export const CONTRACT_ADDRESS = "place for contract xD";

export const ABI = [
  {
    inputs: [
      { internalType: "string", name: "_title", type: "string" },
      { internalType: "string", name: "_cid", type: "string" },
    ],
    name: "addBook",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_index", type: "uint256" }],
    name: "deleteBook",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getBooks",
    outputs: [
      {
        components: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "string", name: "title", type: "string" },
          { internalType: "string", name: "cid", type: "string" },
          { internalType: "bool", name: "isDeleted", type: "bool" },
        ],
        internalType: "struct BookLibrary.Book[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export async function getProvider() {
  if (!window.ethereum) {
    throw new Error("MetaMask not found");
  }

  return new ethers.BrowserProvider(window.ethereum);
}

export async function requestWalletConnection() {
  const provider = await getProvider();
  await provider.send("eth_requestAccounts", []);
  return provider;
}

export async function getReadOnlyContract() {
  const provider = await getProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
}

export async function getSignedContract() {
  const provider = await requestWalletConnection();
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
}

export async function getCurrentWalletInfo() {
  const provider = await getProvider();
  const network = await provider.getNetwork();
  const accounts = await provider.send("eth_accounts", []);

  return {
    chainId: network.chainId.toString(),
    networkName: network.name,
    account: accounts[0] || null,
  };
}

export async function fetchBooksFromContract() {
  const contract = await getReadOnlyContract();
  const books = await contract.getBooks();

  return books.map((book, index) => ({
    id: index,
    owner: book.owner,
    title: book.title,
    cid: book.cid,
    isDeleted: book.isDeleted,
  }));
}

export async function addBookToContract(title, cid) {
  const contract = await getSignedContract();
  const tx = await contract.addBook(title, cid);
  await tx.wait();
}

export async function deleteBookFromContract(bookId) {
  const contract = await getSignedContract();
  const tx = await contract.deleteBook(bookId);
  await tx.wait();
}
