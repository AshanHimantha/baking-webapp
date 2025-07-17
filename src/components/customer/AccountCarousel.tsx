import { CreditCard, ShieldCheck, PiggyBank } from "lucide-react";

// Define icons and styles for each account type for a creative touch
const accountTypeDetails = {
  CURRENT: {
    icon: CreditCard,
    gradient: "from-blue-400 to-blue-800",
    shadow: "shadow-blue-500/50",
	img : "/R4.jpg",
  },
  SAVING: {
    icon: PiggyBank,
    gradient: "from-green-400 to-green-800",
    shadow: "shadow-green-500/50",
	img : "/R3.jpg",
  },
  FIXED: {
    icon: ShieldCheck,
    gradient: "from-yellow-400 to-yellow-800",
    shadow: "shadow-yellow-500/50",
	img : "/R.jpg",
  },
  DEFAULT: {
    icon: CreditCard,
    gradient: "from-gray-400 to-gray-800",
    shadow: "shadow-gray-500/50",
	img : "/R.jpg",
  },
};

const AccountCarousel = ({ accounts }) => {
  return (
    <div >
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">Your Accounts</h2>
      <div className="flex space-x-4 sm:space-x-6 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 p-2">
        {accounts.map((account) => {
          const details = accountTypeDetails[account.accountType] || accountTypeDetails.DEFAULT;
          const Icon = details.icon;

          return (
			<div
			  key={account.id}
			  className={`relative flex-shrink-0 w-72 h-44 rounded-xl text-white p-6 flex flex-col justify-between overflow-hidden transform transition-transform duration-300 hover:scale-105 bg-gradient-to-br ${details.gradient} shadow-lg ${details.shadow}`}
			>
			  {/* Background image with opacity */}
			  <div className="absolute inset-0 z-0">
				<img
				  src={details.img}
				  alt=""
				  className="w-full h-full object-cover opacity-5"

				/>
			  </div>
			  {/* Abstract background pattern */}
			  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-12 -translate-y-12 opacity-50"></div>
			  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full transform -translate-x-8 translate-y-8 opacity-50"></div>

			  <div className="relative z-10">
				<div className="flex justify-between items-start">
				  <div>
					<p className="text-sm opacity-80">{account.accountType}</p>
					<p className="font-semibold text-lg">{account.ownerName}</p>
				  </div>
				  <Icon className="w-6 h-6 text-white/80" />
				</div>
			  </div>

			  <div className="relative z-10 text-right">
				<p className="text-sm opacity-80">Balance</p>
				<p className="text-2xl font-bold">
				  ${(account.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
				</p>
				<p className="text-xs font-mono tracking-widest opacity-80 mt-1">{account.accountNumber}</p>
			  </div>
			</div>
          );
        })}

        {/* Placeholder for adding a new account */}
        <div className="flex-shrink-0 w-72 h-44 rounded-xl border-2 border-dashed border-muted-foreground/50 flex items-center justify-center hover:bg-muted/50 transition-colors">
          <div className="text-center text-muted-foreground">
            <p className="font-semibold">Add New Account</p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AccountCarousel;