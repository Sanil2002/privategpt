export const ChatNavbar = () => {
    return (
        <div className="flex max-h-[80px] w-full rounded-[12px] px-[24px] py-[18px] justify-between items-center self-stretch">
            <div className="w-[165px] h-[32px] flex flex-row justify-center items-center gap-[10px] rounded-[50px] bg-gray-200">
                <h1 className="text-[#000] font-Nunito text-[20px] font-normal">Civic.ai v-0.1</h1>
                <div className="w-[18px] h-[18px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M14.9231 7.04813L9.2981 12.6731C9.219 12.7521 9.11177 12.7965 8.99997 12.7965C8.88818 12.7965 8.78095 12.7521 8.70185 12.6731L3.07685 7.04813C3.00233 6.96816 2.96176 6.86238 2.96369 6.75309C2.96562 6.64379 3.00989 6.53951 3.08719 6.46222C3.16448 6.38492 3.26876 6.34065 3.37806 6.33872C3.48735 6.33679 3.59313 6.37736 3.6731 6.45188L8.99997 11.7781L14.3268 6.45188C14.4068 6.37736 14.5126 6.33679 14.6219 6.33872C14.7312 6.34065 14.8355 6.38492 14.9128 6.46222C14.9901 6.53951 15.0343 6.64379 15.0363 6.75309C15.0382 6.86238 14.9976 6.96816 14.9231 7.04813Z" fill="black" />
                    </svg>
                </div>
            </div>
            <div className="w-[36px] h-[36px] rounded-[32px] border-[2px] border-[#2DA6D2] bg-lightgray bg-center bg-cover bg-no-repeat">
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQix-88qLi0p7Gx36Kq6KvDQI2C_1C3WPnmBiKtWIUgrOLKP8Db7xQyJZVFACvKz_zASA&usqp=CAU"
                    alt="1"
                    className="w-full h-full object-cover rounded-[36px]" />
            </div>
        </div>
    )
}