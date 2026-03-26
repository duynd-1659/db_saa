import Image from 'next/image';
import { useTranslations } from 'next-intl';

export function RootFurtherSection(): React.ReactElement {
  const t = useTranslations('homepage');

  return (
    <section className="w-full flex justify-center">
      <div className="px-4 md:px-10 lg:px-[var(--spacing-page-x)] w-full max-w-[1440px] mx-auto flex flex-col items-center gap-8 py-[120px]">
        {/* ROOT FURTHER title image */}
        <Image
          src="/assets/homepage/images/root-further-center.png"
          alt="ROOT FURTHER"
          width={290}
          height={134}
          className="w-auto"
        />

        {/* Description */}
        <p className="text-justify text-base md:text-lg leading-6 md:leading-7 tracking-[0.5px] text-white font-normal max-w-full mx-auto">
          Đứng trước bối cảnh thay đổi như vũ bão của thời đại AI và yêu cầu ngày càng cao từ khách
          hàng, Sun* lựa chọn chiến lược đa dạng hóa năng lực để không chỉ nỗ lực trở thành tinh anh
          trong lĩnh vực của mình, mà còn hướng đến một cái đích cao hơn, nơi mọi Sunner đều là
          “problem-solver” - chuyên gia trong việc giải quyết mọi vấn đề, tìm lời giải cho mọi bài
          toán của dự án, khách hàng và xã hội. Lấy cảm hứng từ sự đa dạng năng lực, khả năng phát
          triển linh hoạt cùng tinh thần đào sâu để bứt phá trong kỷ nguyên AI,{' '}
          <span className="font-bold text-(--Details-Text-Primary-1)">“Root Further”</span> đã được
          chọn để trở thành chủ đề chính thức của Lễ trao giải Sun* Annual Awards 2025. Vượt ra khỏi
          nét nghĩa bề mặt,{' '}
          <span className="font-bold text-(--Details-Text-Primary-1)">“Root Further”</span> chính là
          hành trình chúng ta không ngừng vươn xa hơn, cắm rễ mạnh hơn, chạm đến những tầng “địa
          chất” ẩn sâu để tiếp tục tồn tại, vươn lên và nuôi dưỡng đam mê kiến tạo giá trị luôn cháy
          bỏng của người Sun*. Mượn hình ảnh bộ rễ liên tục đâm sâu vào lòng đất, mạnh mẽ len lỏi
          qua từng lớp “trầm tích” để thẩm thấu những gì tinh tuý nhất, người Sun* cũng đang “hấp
          thụ” dưỡng chất từ thời đại và những thử thách của thị trường để làm mới mình mỗi ngày, mở
          rộng năng lực và mạnh mẽ “bén rễ” vào kỷ nguyên AI - một tầng “địa chất” hoàn toàn mới,
          phức tạp và khó đoán, nhưng cũng hội tụ vô vàn tiềm năng cùng cơ hội.
        </p>

        <div className="flex flex-col items-center gap-2 py-1 md:py-2">
          <p className="text-center text-xl md:text-2xl font-bold text-white">
            “A tree with deep roots fears no storm”
          </p>
          <p className="text-center text-sm md:text-base text-(--Details-Text-Secondary-1) italic">
            (Cây sâu bén rễ, bão giông chẳng nể - Ngạn ngữ Anh)
          </p>
        </div>

        <p className="text-justify text-base md:text-lg leading-6 md:leading-7 tracking-[0.5px] text-white font-normal max-w-full mx-auto">
          Trước giông bão, chỉ những tán cây có bộ rễ đủ mạnh mới có thể trụ vững. Một tổ chức với
          những cá nhân tự tin vào năng lực đa dạng, sẵn sàng kiến tạo và đón nhận thử thách, làm
          chủ sự thay đổi là tổ chức không chỉ vững vàng trước biến động, mà còn khai thác được mọi
          lợi thế, chinh phục các thách thức của thời cuộc. Không đơn thuần là tên gọi của chương
          mới trên hành trình phát triển tổ chức,{' '}
          <span className="font-bold text-(--Details-Text-Primary-1)">“Root Further”</span> còn như
          một lời cổ vũ, động viên mỗi chúng ta hãy dám tin vào bản thân, dám đào sâu, khai mở mọi
          tiềm năng, dám phá bỏ giới hạn, dám trở thành phiên bản đa nhiệm và xuất sắc nhất của
          mình. Bởi trong thời đại AI, đa dạng năng lực và tận dụng sức mạnh thời cuộc chính là điều
          kiện tiên quyết để trường tồn. Không ai biết trước ẩn sâu trong “lòng đất” của ngành công
          nghệ và thị trường hiện đại còn biết bao tầng “địa chất” bí ẩn. Chỉ biết rằng khi{' '}
          <span className="font-bold text-(--Details-Text-Primary-1)">“Root Further”</span> đã trở
          thành tinh thần cội rễ, chúng ta sẽ không sợ hãi, mà càng thấy háo hức trước bất cứ vùng
          vô định nào trên hành trình tiến về phía trước. Vì ta luôn tin rằng, trong chính những
          miền vô tận đó, là bao điều kỳ diệu và cơ hội vươn mình đang chờ ta.
        </p>
      </div>
    </section>
  );
}
