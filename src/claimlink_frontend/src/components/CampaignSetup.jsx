import React, { useState } from 'react';

const CampaignSetup = () => {
  const [title, setTitle] = useState('');
  const [contract, setContract] = useState('NFTs');
  const [collection, setCollection] = useState('');

  const handleNext = () => {
    // Implement your "Next" button functionality here
  };

  return (
    <div className="flex p-8">
      <div className="w-2/3 p-4 border rounded-md">
        <h1 className="text-2xl font-bold mb-4">Campaign setup</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input 
            type="text" 
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Contract</label>
          <div className="mt-2 flex">
            <button 
              className={`flex-1 p-4 border rounded-md ${contract === 'NFTs' ? 'border-indigo-500' : 'border-gray-300'}`}
              onClick={() => setContract('NFTs')}
            >
              <div className="flex items-center justify-center">
                <span className="text-lg">NFTs</span>
              </div>
            </button>
            <button 
              className={`flex-1 p-4 ml-4 border rounded-md ${contract === 'Tokens' ? 'border-indigo-500' : 'border-gray-300'}`}
              onClick={() => setContract('Tokens')}
            >
              <div className="flex items-center justify-center">
                <span className="text-lg">Tokens</span>
              </div>
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Choose collection</label>
          <input 
            type="text" 
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>

      <div className="w-1/3 p-4 ml-4 border rounded-md">
        <h2 className="text-xl font-bold mb-4">Summary</h2>
        <p className="mb-2"><strong>Title of campaign:</strong> {title || 'Title'}</p>
        <p className="mb-2"><strong>Token address:</strong> 0xf8c...992h4</p>
        <p className="mb-2"><strong>Token name:</strong> ICRC-7 Token</p>
        <p className="mb-2"><strong>Token standard:</strong> ICRC-7</p>
        <p className="mb-2"><strong>ID/Copies:</strong> 1/1 per link / 10 links</p>
        <p className="mb-2"><strong>Total links:</strong> 10</p>
        <p className="mb-2"><strong>Claim pattern:</strong> Transfer</p>
        <p className="mb-2"><strong>To be secured:</strong> 0.0 ICP</p>
        <p className="mb-2"><strong>Included into the links:</strong> 0.0 ICP</p>
        <p className="mb-2"><strong>Total amount:</strong> 0.0 ICP</p>
      </div>
    </div>
  );
};

export default CampaignSetup;
