---
document_type: "Master Plan / System Requirements Specification"
project_name: "Nền tảng Quản lý Chủ nhiệm & Phối hợp Giáo dục Toàn trường"
short_name: "School Homeroom & Student Support Platform"
version: "1.1"
baseline_date: "2026-08-26"
language: "vi-VN"
timezone_default: "Asia/Ho_Chi_Minh"
status: "Planning Baseline + Offline-first / UX Extension"
audience:
  - "Ban giám hiệu"
  - "Tổ trưởng chuyên môn"
  - "Giáo viên chủ nhiệm"
  - "Giáo viên bộ môn"
  - "Đội phát triển phần mềm"
  - "AI coding agent / AI architect / AI tester"
  - "AI UI/UX agent / frontend coding agent"
  - "Cán bộ CNTT"
  - "Văn thư, lưu trữ"
  - "Cán bộ tư vấn học đường / công tác xã hội"
  - "Y tế trường học"
regulatory_scope: "Cơ sở giáo dục phổ thông tại Việt Nam"
---

# MASTER PLAN: NỀN TẢNG QUẢN LÝ CHỦ NHIỆM & PHỐI HỢP GIÁO DỤC TOÀN TRƯỜNG

> Tài liệu này là đặc tả nền tảng cấp hệ thống. Mục tiêu là để một đội phát triển hoặc một AI khác có thể đọc độc lập và hiểu được: hệ thống cần làm gì, ai được làm gì, dữ liệu nào là nguồn chuẩn, quy trình nào phải tuân thủ, dữ liệu nào cần lưu trữ, cách tích hợp, cách kiểm thử và lộ trình triển khai.

## Lịch sử phiên bản

| Phiên bản | Ngày | Nội dung |
|---|---|---|
| 1.0 | 26/08/2026 | Baseline pháp lý, nghiệp vụ, phân quyền, học bạ số, hồ sơ toàn trường |
| 1.1 | 26/08/2026 | Bổ sung sơ đồ lớp/chia tổ, quỹ lớp, nề nếp, gradebook chi tiết, Excel nhanh, offline-first PC/Android, sync merge/conflict, mobile-first, design system và AI UI skills |

---

# 0. QUY ƯỚC ĐỌC TÀI LIỆU DÀNH CHO AI VÀ ĐỘI PHÁT TRIỂN

## 0.1. Từ khóa bắt buộc

- **MUST / PHẢI**: yêu cầu bắt buộc để nghiệm thu.
- **MUST NOT / KHÔNG ĐƯỢC**: hành vi bị cấm.
- **SHOULD / NÊN**: yêu cầu khuyến nghị mạnh, chỉ bỏ nếu có lý do kỹ thuật/nghiệp vụ được phê duyệt.
- **SHOULD NOT / KHÔNG NÊN**: cần tránh.
- **MAY / CÓ THỂ**: tùy chọn.

## 0.2. Mã yêu cầu

Mỗi nhóm yêu cầu dùng mã ổn định để AI/code/test có thể tham chiếu:

- `CORE-*`: nguyên tắc lõi.
- `CFG-*`: cấu hình hệ thống.
- `IAM-*`: tài khoản, xác thực.
- `PERM-*`: phân quyền.
- `ORG-*`: tổ chức trường/năm học/lớp.
- `STAFF-*`: hồ sơ cán bộ, giáo viên.
- `STU-*`: hồ sơ học sinh.
- `CLS-*`: quản lý lớp/chủ nhiệm.
- `FIN-*`: quỹ lớp, khoản thu/chi và đối soát tài chính lớp.
- `BHV-*`: nhật ký nề nếp/hành vi và điểm quy ước nội bộ.
- `ATT-*`: chuyên cần.
- `ASM-*`: đánh giá học tập/rèn luyện.
- `HBS-*`: học bạ số.
- `HMR-*`: sổ chủ nhiệm.
- `PAR-*`: phụ huynh/người giám hộ.
- `COM-*`: liên lạc/thông báo.
- `RWD-*`: khen thưởng.
- `DSC-*`: kỷ luật/sự việc.
- `CNS-*`: tư vấn học đường/công tác xã hội.
- `ACT-*`: hoạt động/trải nghiệm/hướng nghiệp.
- `INC-*`: hòa nhập/nhu cầu hỗ trợ đặc thù.
- `HLT-*`: sức khỏe học sinh.
- `TASK-*`: lịch, nhiệm vụ, workflow.
- `DOC-*`: hồ sơ/tài liệu.
- `ARC-*`: lưu trữ.
- `RPT-*`: báo cáo.
- `AI-*`: trợ lý AI.
- `INT-*`: tích hợp/API.
- `SYNC-*`: offline-first, đồng bộ thiết bị/server và xử lý xung đột.
- `UX-*`: design system, responsive, accessibility và tiêu chuẩn giao diện.
- `AUD-*`: nhật ký/audit.
- `SEC-*`: an toàn thông tin.
- `PRI-*`: bảo vệ dữ liệu cá nhân.
- `OPS-*`: vận hành.
- `NFR-*`: yêu cầu phi chức năng.
- `TST-*`: kiểm thử/nghiệm thu.

## 0.3. Nguyên tắc không suy diễn

AI hoặc lập trình viên triển khai tài liệu này **KHÔNG ĐƯỢC** tự ý:

1. tạo thêm hồ sơ bắt buộc cho giáo viên nếu pháp luật không yêu cầu;
2. coi một trường dữ liệu nhạy cảm là dữ liệu công khai;
3. cấp quyền theo tên chức danh mà bỏ qua phạm vi lớp/khối/tổ;
4. sửa dữ liệu đã ký số/phát hành trực tiếp;
5. xóa cứng hồ sơ có nghĩa vụ lưu trữ;
6. dùng AI để tự động kết luận tâm lý, kỷ luật, xếp loại hoặc phát hành nhận xét chính thức;
7. dùng tên học sinh + ngày sinh làm khóa định danh duy nhất;
8. nhân bản dữ liệu điểm/học bạ ở nhiều bảng làm nhiều “nguồn chuẩn”.
9. dùng điểm nề nếp nội bộ để tự động quyết định mức rèn luyện/kỷ luật chính thức;
10. ghi đè toàn bộ bản ghi khi đồng bộ nếu hai thiết bị đã sửa các trường khác nhau;
11. cho phép sửa/xóa trực tiếp giao dịch quỹ đã ghi sổ thay vì dùng nghiệp vụ điều chỉnh/đảo giao dịch;
12. tải toàn bộ dữ liệu nhạy cảm xuống thiết bị chỉ để “phòng khi mất mạng”.

---

# 1. MỤC TIÊU SẢN PHẨM

## 1.1. Mục tiêu tổng thể

Xây dựng một nền tảng dùng chung cho toàn trường để:

1. số hóa công tác chủ nhiệm;
2. tạo một hồ sơ học sinh thống nhất, liên tục qua các năm học;
3. giúp GVCN phối hợp với giáo viên bộ môn, phụ huynh, Ban giám hiệu và bộ phận hỗ trợ;
4. giảm nhập liệu trùng lặp;
5. tự động tổng hợp sổ chủ nhiệm và báo cáo từ dữ liệu gốc;
6. hỗ trợ đánh giá đúng cấp học;
7. quản lý học bạ số theo hướng tương thích quy định 2026;
8. quản lý hồ sơ và thời hạn lưu trữ;
9. tạo lịch sử truy vết đầy đủ;
10. quản lý phân quyền chi tiết đến cấp trường/khối/lớp/học sinh/trường dữ liệu;
11. tích hợp được với CSDL trường, CSDL ngành, học bạ số, chữ ký số và các nền tảng khác;
12. cung cấp dashboard giúp giáo viên biết **việc cần làm**, thay vì chỉ cung cấp nơi nhập dữ liệu;
13. hỗ trợ AI an toàn để giảm công việc hành chính nhưng giữ quyền quyết định cho con người.
14. hoạt động **offline-first** trên PC và Android cho các tác vụ cốt lõi, sau đó đồng bộ hai chiều khi có mạng;
15. cung cấp cơ chế merge dữ liệu theo trường/phiên bản để dữ liệu khác nhau ở hai phía có thể được kế thừa thay vì ghi đè mất dữ liệu;
16. cung cấp sơ đồ chỗ ngồi, chia tổ, nhật ký nề nếp, quỹ lớp, nhập/xuất Excel và thao tác nhanh phục vụ công việc GVCN hàng ngày;
17. giao diện hoàn toàn tiếng Việt, mobile-first, dùng định dạng 24 giờ và múi giờ mặc định `Asia/Ho_Chi_Minh` (UTC+07:00).

## 1.2. Chỉ số thành công

- Giảm tối thiểu 50% thao tác nhập dữ liệu trùng lặp so với quy trình Excel/sổ rời.
- 100% thay đổi dữ liệu quan trọng có audit log.
- 100% tài liệu/hồ sơ chính thức có trạng thái vòng đời.
- 100% quyền truy cập dữ liệu nhạy cảm được kiểm soát theo phạm vi.
- 100% báo cáo chuẩn lấy từ dữ liệu hệ thống, không yêu cầu giáo viên nhập lại.
- GVCN có thể hoàn thành tác vụ phổ biến trong <= 3 lần tương tác chính.
- Hệ thống có thể chuyển năm học mà không làm mất lịch sử.
- Có khả năng cấu hình cho tiểu học, THCS, THPT và trường nhiều cấp.
- Các tác vụ cốt lõi vẫn dùng được khi mất mạng; trạng thái đồng bộ/conflict luôn nhìn thấy được.
- Dữ liệu sửa khác trường trên hai thiết bị được merge tự động khi an toàn; xung đột cùng trường được đưa vào quy trình xử lý thay vì ghi đè im lặng.
- 100% số dư quỹ được tính từ sổ cái giao dịch, không nhập tay trực tiếp.
- Giao diện đạt chuẩn mobile-first, touch target >= 44x44 px và hỗ trợ tiếng Việt đầy đủ dấu.

---

# 2. PHẠM VI HỆ THỐNG

## 2.1. Trong phạm vi

- Quản trị người dùng và phân quyền.
- Cấu hình trường và năm học.
- Danh mục tổ chức: khối, lớp, tổ, môn, giáo viên.
- Hồ sơ học sinh 360°.
- Hồ sơ phụ huynh/người giám hộ.
- Phân công GVCN/GVBM.
- Chuyên cần, đơn xin nghỉ và phê duyệt nghỉ.
- Theo dõi học tập/rèn luyện và nhận dữ liệu đánh giá.
- Sổ chủ nhiệm điện tử.
- Học bạ số và quy trình ký/phát hành ở mức nền tảng tích hợp.
- Sinh hoạt lớp.
- Hoạt động trải nghiệm/hướng nghiệp/phong trào.
- Khen thưởng, sự việc và quy trình kỷ luật.
- Tư vấn học đường/công tác xã hội.
- Hỗ trợ học sinh cần quan tâm.
- Hồ sơ học sinh khuyết tật/hòa nhập theo phân quyền.
- Hồ sơ sức khỏe cơ bản hoặc tích hợp y tế trường học.
- Trao đổi phụ huynh.
- Thông báo và xác nhận đã đọc.
- Nhiệm vụ, lịch, deadline.
- Hồ sơ tài liệu, phiên bản, ký số, lưu trữ.
- Dashboard và báo cáo.
- API/import/export.
- Audit, bảo mật, sao lưu.
- Trợ lý AI kiểm soát được.

## 2.2. Ngoài phạm vi lõi nhưng phải sẵn sàng tích hợp

- LMS đầy đủ.
- Xếp thời khóa biểu chuyên sâu.
- Thu học phí/kế toán.
- Thư viện.
- Quản lý thiết bị.
- Chấm công/tiền lương.
- Tuyển sinh chuyên sâu.
- Camera/nhận diện khuôn mặt.

Các hệ thống trên không cần xây lại nếu trường đã có. Nền tảng MUST hỗ trợ tích hợp qua API/import/event.

---

# 3. CĂN CỨ PHÁP LÝ VÀ BASELINE 2026

> Lưu ý: đây là baseline kỹ thuật/nghiệp vụ tại ngày 26/08/2026, không phải tư vấn pháp lý. Trước khi go-live phải thực hiện `Legal Review` lần cuối.

## 3.1. Văn bản cốt lõi

1. **Thông tư 15/2026/TT-BGDĐT** — Điều lệ trường tiểu học, THCS, THPT và trường phổ thông nhiều cấp; ban hành 24/03/2026, hiệu lực 10/05/2026.  
   Nguồn chính thức: https://vanban.chinhphu.vn/?classid=1&docid=217678&pageid=27160&typegroupid=6

2. **Thông tư 30/2026/TT-BGDĐT** — Chuẩn nghề nghiệp giáo viên cơ sở giáo dục phổ thông; ban hành/hiệu lực 14/04/2026.  
   Nguồn: https://vanban.chinhphu.vn/?classid=1&docid=217839&orggroupid=4&pageid=27160

3. **Nghị định 88/2026/NĐ-CP** — Quản lý dữ liệu giáo dục và đào tạo; hiệu lực 15/05/2026; nền tảng số giáo dục quốc gia, hồ sơ học tập suốt đời, mã số hồ sơ học tập suốt đời.  
   Nguồn: https://vanban.chinhphu.vn/?docid=217356&pageid=27160

4. **Thông tư 70/2026/TT-BGDĐT** — Quản lý và sử dụng học bạ số; ban hành 22/08/2026; **hiệu lực 08/10/2026**. Hệ thống xây trong năm 2026 SHOULD tương thích ngay từ kiến trúc.  
   Nguồn: https://chinhphu.vn/?docid=219275&pageid=27160&typegroupid=6

5. **Thông tư 08/2025/TT-BGDĐT** — Thời hạn lưu trữ hồ sơ, tài liệu thuộc lĩnh vực giáo dục và đào tạo; hiệu lực 01/07/2025.  
   Nguồn: https://vbpl.vn/TW/Pages/vbpq-toanvan.aspx?ItemID=177565

6. **Thông tư 19/2025/TT-BGDĐT** — Khen thưởng và kỷ luật học sinh; hiệu lực 31/10/2025.  
   Nguồn: https://vbpl.vn/TW/Pages/vbpq-toanvan.aspx?ItemID=183381&Keyword=

7. **Thông tư 18/2025/TT-BGDĐT** — Tư vấn học đường và công tác xã hội trong trường học; hiệu lực 31/10/2025.  
   Nguồn: https://vbpl.vn/bogiaoducdaotao/Pages/vbpq-toanvan.aspx?ItemID=183285

8. **Thông tư 05/2025/TT-BGDĐT** — Chế độ làm việc đối với giáo viên phổ thông, dự bị đại học; hiệu lực 22/04/2025.  
   Nguồn: https://chinhphu.vn/?docid=213113&pageid=27160

9. **Thông tư 27/2020/TT-BGDĐT** — Đánh giá học sinh tiểu học.  
   Nguồn: https://vbpl.vn/TW/Pages/vbpq-print.aspx?ItemID=144123

10. **Thông tư 22/2021/TT-BGDĐT** — Đánh giá học sinh THCS và THPT; tình trạng còn hiệu lực tại baseline.  
    Nguồn: https://vbpl.vn/bogiaoducdaotao/Pages/ivbpq-thuoctinh.aspx?ItemID=150073

11. **Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15** — hiệu lực 01/01/2026.  
    Nguồn: https://vanban.chinhphu.vn/?classid=1&docid=214590&pageid=27160&typegroup=

12. **Luật Dữ liệu 60/2024/QH15** — hiệu lực 01/07/2025.  
    Nguồn: https://vanban.chinhphu.vn/?classid=1&docid=212488&pageid=27160

13. **Luật Giao dịch điện tử 20/2023/QH15** — hiệu lực 01/07/2024.  
    Nguồn: https://vanban.chinhphu.vn/?docid=208421&pageid=27160

14. **Nghị định 23/2025/NĐ-CP** — Chữ ký điện tử và dịch vụ tin cậy; hiệu lực 10/04/2025.  
    Nguồn: https://vanban.chinhphu.vn/?classid=1&docid=212829&pageid=27160

15. **Thông tư 55/2011/TT-BGDĐT** — Điều lệ Ban đại diện cha mẹ học sinh; tại baseline 26/08/2026, CSDL quốc gia về VBPL vẫn ghi nhận **còn hiệu lực**. Kinh phí Ban đại diện phải bảo đảm nguyên tắc tự nguyện, công khai, dân chủ và có các khoản không được phép quyên góp/chi. Phân hệ quỹ lớp phải được cấu hình theo đúng phạm vi hợp pháp, không mặc định mọi “quỹ lớp” đều hợp lệ.  
    Nguồn: https://vbpl.vn/bogiaoducdaotao/Pages/vbpq-thuoctinh.aspx?ItemID=27187

> **Cảnh báo thay đổi pháp lý:** tại tháng 08/2026, Bộ GD&ĐT đang lấy ý kiến dự thảo Thông tư mới về Ban đại diện cha mẹ học sinh, dự kiến thay thế Thông tư 55/2011/TT-BGDĐT. Vì vậy `Legal Registry` MUST theo dõi thay đổi này trước khi bật module quỹ/đóng góp trong production.

## 3.2. Các yêu cầu pháp lý được chuyển thành yêu cầu hệ thống

### LEG-001 — Tinh giản hồ sơ giáo viên
Hệ thống MUST không ép giáo viên tạo các “sổ bắt buộc” ngoài danh mục pháp lý chỉ vì phần mềm cần dữ liệu. Dữ liệu nghiệp vụ bổ trợ được lưu dưới dạng record/module, sau đó tự sinh báo cáo/sổ.

### LEG-002 — Hồ sơ điện tử là hình thức chủ yếu
Hệ thống MUST hỗ trợ hồ sơ điện tử, kiểm soát phiên bản, khả năng xác thực, xuất bản thể hiện và cơ chế lưu trữ.

### LEG-003 — Sổ chủ nhiệm
GVCN MUST có một sổ chủ nhiệm điện tử theo năm học/lớp; dữ liệu trong sổ SHOULD tự tổng hợp từ dữ liệu gốc.

### LEG-004 — Trách nhiệm GVCN
Workflow MUST hỗ trợ GVCN:
- tổ chức hoạt động giáo dục lớp;
- sinh hoạt lớp;
- theo dõi từng học sinh;
- phối hợp cha mẹ học sinh/GVBM/các bộ phận;
- tổng hợp đánh giá cuối kỳ/năm;
- đề nghị khen thưởng;
- lập danh sách lên lớp/không lên lớp/rèn luyện hè theo cấp học;
- hoàn chỉnh phần học bạ thuộc trách nhiệm;
- quản lý hoạt động trải nghiệm/hướng nghiệp;
- báo cáo định kỳ/đột xuất.

### LEG-005 — Quyền cho nghỉ của GVCN
Hệ thống SHOULD cho phép cấu hình workflow để GVCN phê duyệt lý do nghỉ chính đáng không quá 03 ngày liên tục; trường hợp vượt giới hạn phải chuyển thẩm quyền theo cấu hình của trường.

### LEG-006 — Học bạ số
Hệ thống MUST coi học bạ số là dữ liệu có cấu trúc, không phải PDF. Bản PDF chỉ là bản thể hiện/trích xuất.

### LEG-007 — Học bạ số duy nhất và liên tục
Mỗi người học MUST được ánh xạ đến một hồ sơ học bạ số logic duy nhất gắn mã hồ sơ học tập suốt đời khi dữ liệu đó được cung cấp/đồng bộ.

### LEG-008 — Không sửa trực tiếp học bạ đã phát hành
Sau phát hành/ký số, record MUST immutable. Điều chỉnh phải theo quy trình thu hồi/điều chỉnh/tạo phiên bản mới đúng thẩm quyền.

### LEG-009 — Lưu vết học bạ số
Mọi tạo lập/cập nhật/xác nhận/ký/phát hành/khai thác/chia sẻ MUST có audit trail.

### LEG-010 — Data minimization
Chia sẻ dữ liệu MUST giới hạn đúng mục đích, phạm vi và thẩm quyền.

### LEG-011 — Học tập suốt đời
Mô hình dữ liệu MUST có trường ánh xạ `lifelong_learning_record_id`/mã hồ sơ học tập suốt đời và hỗ trợ cập nhật khi cơ quan quản lý cung cấp.

### LEG-012 — Lưu trữ
Mỗi loại hồ sơ MUST gắn retention policy có hiệu lực theo thời gian; không hard-code một thời hạn chung.

---


### LEG-013 — Quỹ lớp / kinh phí Ban đại diện cha mẹ học sinh
Phân hệ tài chính lớp MUST có legal/policy guard. Trước khi tạo một campaign thu, hệ thống SHOULD yêu cầu chọn loại khoản, căn cứ/policy, phạm vi và trạng thái tự nguyện/bắt buộc theo nguồn pháp lý tương ứng. Không cho phép template mặc định tạo mức “đóng góp bình quân bắt buộc” cho khoản mang tính ủng hộ tự nguyện.

### LEG-014 — Theo dõi dự thảo thay thế Thông tư 55
`Legal Registry` MUST có watch item cho dự thảo Điều lệ Ban đại diện cha mẹ học sinh năm 2026 và tạo migration task nếu văn bản mới được ban hành, nhằm cập nhật rule/permission/workflow của module tài chính và phối hợp phụ huynh mà không sửa code lõi.

# 4. NGUYÊN TẮC KIẾN TRÚC NGHIỆP VỤ

## CORE-001 — Single Source of Truth
Một loại dữ liệu chỉ có một nguồn chuẩn trong hệ thống.

Ví dụ:
- hồ sơ nhân thân HS → `Student Master`;
- quan hệ phụ huynh → `Guardian Relationship`;
- điểm môn → `Assessment Source`;
- chuyên cần → `Attendance Ledger`;
- học bạ phát hành → `Digital Report Card Store`;
- sổ chủ nhiệm → `Generated + curated homeroom record`.

## CORE-002 — Enter Once, Use Many
Nhập một lần, tái sử dụng cho dashboard, sổ chủ nhiệm, báo cáo, hồ sơ và cảnh báo.

## CORE-003 — Workflow First
Dữ liệu quan trọng MUST đi qua trạng thái; không chỉ có CRUD.

Ví dụ:
`DRAFT -> SUBMITTED -> REVIEWED -> APPROVED -> SIGNED -> PUBLISHED -> ARCHIVED`.

## CORE-004 — Immutable History
Dữ liệu chính thức không được mất lịch sử. Dùng versioning/audit thay vì overwrite không truy vết.

## CORE-005 — Configurable by School
Các trường có quy trình nội bộ khác nhau. Hệ thống MUST cấu hình được mà không sửa code cho các yếu tố không bị pháp luật cố định.

## CORE-006 — Legal Rule Versioning
Rule engine MUST lưu `effective_from`, `effective_to`, `legal_basis`, `version`. Không dùng một thuật toán đánh giá cố định cho mọi năm học.

## CORE-007 — Privacy by Design
Quyền truy cập dữ liệu nhạy cảm phải được tính ngay từ mô hình dữ liệu/API/UI.

## CORE-008 — API First
Mọi nghiệp vụ chính SHOULD có service/API rõ ràng để web/mobile/integration dùng chung.

## CORE-009 — Human in the Loop
AI chỉ đề xuất. Quyết định nghiệp vụ chính thức thuộc người có thẩm quyền.

## CORE-010 — Progressive Disclosure
UI chỉ hiển thị thông tin cần cho nhiệm vụ hiện tại; không “dội” toàn bộ hồ sơ nhạy cảm lên một màn hình.

---


## CORE-011 — Local-first, server-synchronized

Hệ thống MUST coi thiết bị người dùng là một node làm việc cục bộ có thể mất mạng, không coi network là điều kiện tiên quyết cho mọi thao tác.

Nguyên tắc:
- tác vụ hàng ngày đã được cho phép offline MUST đọc/ghi vào local store trước;
- thay đổi cục bộ được ghi vào `outbox` dưới dạng operation có ID duy nhất;
- khi có mạng, sync engine đẩy operation lên server và kéo thay đổi mới về;
- UI phải luôn cho biết trạng thái `LOCAL_ONLY`, `SYNCING`, `SYNCED`, `CONFLICT`, `ERROR`;
- không giả vờ “đã lưu trên server” khi mới chỉ lưu local.

## CORE-012 — Merge, không whole-row overwrite

Đồng bộ MUST ưu tiên merge theo field/operation thay vì “bản ghi nào mới hơn thì ghi đè toàn bộ”.

Ví dụ:
- PC sửa `guardian_phone`;
- Android sửa `student_note_visibility`;
- hai thay đổi này phải cùng tồn tại sau sync nếu không xung đột về business rule.

Whole-row last-write-wins chỉ MAY dùng cho dữ liệu UI tạm thời, không dùng cho dữ liệu giáo dục, tài chính, chuyên cần, hồ sơ chính thức hoặc dữ liệu nhạy cảm.

## CORE-013 — Append-only cho ledger và dữ liệu cần đối soát

Các miền dữ liệu có tính sổ cái như:
- quỹ lớp;
- lịch sử điểm nề nếp;
- audit;
- correction history;

SHOULD dùng append-only event/ledger. Sai giao dịch được sửa bằng `REVERSAL`/`ADJUSTMENT`, không sửa im lặng bản gốc.

## CORE-014 — Derived score is not an official decision

Điểm nề nếp, chỉ số cảnh báo, điểm thi đua hoặc score do phần mềm tính là **dữ liệu hỗ trợ**.

MUST NOT:
- tự chuyển thành mức rèn luyện chính thức;
- tự chuyển thành kỷ luật;
- tự gửi nhãn tiêu cực cho phụ huynh;
- dùng làm cơ sở duy nhất cho quyết định giáo dục.

## CORE-015 — Vietnamese-first & deterministic locale

Mọi UI/biểu mẫu mặc định:
- ngôn ngữ `vi-VN`;
- múi giờ `Asia/Ho_Chi_Minh`;
- giờ 24 giờ `HH:mm` hoặc `dd/MM/yyyy HH:mm`;
- ngày hiển thị `dd/MM/yyyy`;
- dữ liệu lưu timestamp chuẩn UTC + timezone context khi cần;
- không phụ thuộc locale của thiết bị để suy diễn định dạng chính thức.

# 5. ĐỐI TƯỢNG SỬ DỤNG VÀ ROLE MẶC ĐỊNH

Hệ thống MUST cho phép tạo role tùy chỉnh. Các role dưới đây là template mặc định.

1. `SUPER_ADMIN_TECH` — quản trị kỹ thuật nền tảng.
2. `SCHOOL_ADMIN` — quản trị cấu hình trường.
3. `PRINCIPAL` — hiệu trưởng.
4. `VICE_PRINCIPAL` — phó hiệu trưởng theo phạm vi phân công.
5. `ACADEMIC_LEAD` — tổ trưởng/tổ phó chuyên môn.
6. `HOMEROOM_TEACHER` — GVCN.
7. `SUBJECT_TEACHER` — GVBM.
8. `TEAM_YOUTH_OFFICER` — Tổng phụ trách Đội/Bí thư Đoàn/người phụ trách hoạt động.
9. `COUNSELOR_SOCIAL_WORK` — tư vấn học đường/công tác xã hội.
10. `SCHOOL_HEALTH` — y tế trường học.
11. `OFFICE_RECORDS` — văn thư/lưu trữ.
12. `DATA_OPERATOR` — cán bộ nhập/đối soát dữ liệu được phân công.
13. `PARENT_GUARDIAN` — cha mẹ/người giám hộ.
14. `STUDENT` — học sinh.
15. `AUDITOR_READONLY` — thanh tra/kiểm tra/kiểm toán theo thời hạn và phạm vi.
16. `API_SERVICE_ACCOUNT` — tài khoản tích hợp máy-máy.

## 5.1. Role không đồng nghĩa với quyền tuyệt đối

Ví dụ `HOMEROOM_TEACHER` không có nghĩa được xem mọi hồ sơ tư vấn của học sinh. Quyền phải tính thêm:

`Permission = Role + Action + Resource + Scope + DataClassification + Context + Time`.

---

# 6. KIẾN TRÚC PHÂN QUYỀN CHI TIẾT

## 6.1. Mô hình RBAC + ABAC

Hệ thống MUST kết hợp:

- **RBAC**: quyền theo role.
- **ABAC**: điều kiện theo thuộc tính.

Thuộc tính ABAC tối thiểu:
- trường;
- năm học;
- cấp học;
- khối;
- lớp;
- tổ chuyên môn;
- quan hệ với học sinh;
- môn giảng dạy;
- vai trò chủ nhiệm;
- người tạo hồ sơ;
- người được phân công xử lý;
- mức độ nhạy cảm;
- trạng thái hồ sơ;
- thời gian hiệu lực của phân công;
- mục đích khai thác.

## 6.2. Action chuẩn

`VIEW_LIST`, `VIEW_DETAIL`, `CREATE`, `EDIT`, `DELETE_DRAFT`, `SUBMIT`, `REVIEW`, `APPROVE`, `REJECT`, `SIGN`, `PUBLISH`, `REVOKE`, `EXPORT`, `PRINT`, `SHARE`, `DOWNLOAD_ATTACHMENT`, `UPLOAD_ATTACHMENT`, `COMMENT`, `ASSIGN`, `ARCHIVE`, `RESTORE`, `CONFIGURE`, `IMPERSONATE_SUPPORT`, `VIEW_AUDIT`.

## 6.3. Scope chuẩn

- `SELF`
- `OWN_CHILD`
- `ASSIGNED_STUDENT`
- `OWN_HOMEROOM_CLASS`
- `OWN_SUBJECT_CLASSES`
- `OWN_GRADE`
- `OWN_DEPARTMENT`
- `ASSIGNED_CLASSES`
- `SCHOOL`
- `MULTI_SCHOOL` (chỉ nếu triển khai cụm trường)
- `EXPLICIT_LIST`

## 6.4. Phân loại dữ liệu

- `PUBLIC_INTERNAL`: thông tin nội bộ ít nhạy cảm.
- `EDUCATION_STANDARD`: dữ liệu giáo dục thông thường.
- `PERSONAL`: dữ liệu cá nhân.
- `SENSITIVE`: hồ sơ sức khỏe, tư vấn, hoàn cảnh đặc biệt, dữ liệu cần hạn chế mạnh.
- `SEALED_CASE`: hồ sơ sự việc đặc biệt chỉ người được phân công.

## PERM-001
Backend MUST kiểm tra quyền. UI ẩn nút không được coi là biện pháp bảo mật.

## PERM-002
Mỗi API MUST xác định `resource`, `action`, `scope`.

## PERM-003
Quyền có thể có `effective_from/effective_to` để tự hết hạn khi giáo viên đổi lớp hoặc hết năm học.

## PERM-004
Quyền đặc biệt tạm thời MUST có lý do, người cấp, thời hạn và audit.

## PERM-005
Tài khoản kỹ thuật `SUPER_ADMIN_TECH` SHOULD mặc định không đọc nội dung `SENSITIVE/SEALED_CASE`; nếu cần hỗ trợ phải dùng cơ chế break-glass được audit.

## PERM-006 — Break Glass
Quy trình truy cập khẩn cấp:
1. yêu cầu quyền;
2. ghi lý do;
3. xác thực lại/MFA;
4. quyền có TTL ngắn;
5. gửi cảnh báo cho người giám sát;
6. log toàn bộ hành động.

## 6.5. Ma trận quyền mặc định rút gọn

| Resource | BGH | GVCN | GVBM | Tổ trưởng | Tư vấn | Y tế | Văn thư | PHHS | HS |
|---|---|---|---|---|---|---|---|---|---|
| Hồ sơ nhân thân HS | Trường | Lớp CN | Lớp dạy: giới hạn | Theo phạm vi | Khi phân công | Khi cần | Theo nhiệm vụ | Con mình | Bản thân: giới hạn |
| Chuyên cần | Trường | CRUD lớp CN | Ghi theo tiết nếu bật | Xem tổng hợp | Xem khi cần | Xem khi cần | Không mặc định | Con mình | Bản thân |
| Điểm/đánh giá môn | Xem | Xem lớp CN | CRUD môn mình | Xem tổ | Không mặc định | Không | Không | Con mình | Bản thân |
| Sổ chủ nhiệm | Xem/duyệt | CRUD lớp CN | Góp ý được phân quyền | Xem theo phân công | Góp ý case | Không | Lưu trữ | Không | Không |
| Hồ sơ tư vấn | Metadata/được phép | Chỉ phần được chia sẻ | Không mặc định | Không | CRUD case | Theo chia sẻ | Metadata lưu trữ | Chỉ nội dung được công bố | Chỉ nội dung được công bố |
| Hồ sơ sức khỏe | Theo thẩm quyền | Tóm tắt cần biết | Cờ cảnh báo cần biết | Không | Theo case | CRUD | Metadata | Con mình | Bản thân: phù hợp tuổi |
| Kỷ luật/sự việc | Theo thẩm quyền | Lớp CN | Tạo ghi nhận | Theo phân công | Theo case | Theo case | Lưu trữ | Kết quả được thông báo | Kết quả được thông báo |
| Học bạ số | Quản lý/ký theo quyền | Hoàn chỉnh phần được giao | Cập nhật phần môn | Kiểm tra tùy trường | Không | Không | Lưu/trích lục theo quyền | Tra cứu con mình | Tra cứu bản thân |
| Audit | Theo quyền | Log của tác vụ liên quan | Log của mình | Theo phạm vi | Theo case | Theo case | Theo hồ sơ | Không | Không |

> Ma trận trên là default. Engine quyền chi tiết phải dùng permission codes; không hard-code theo bảng này.

---

# 7. PHÂN HỆ CẤU HÌNH TRƯỜNG

## 7.1. Cấu hình danh tính trường

`CFG-001` MUST quản lý:
- mã trường;
- tên trường;
- loại hình;
- cấp học;
- địa chỉ;
- đơn vị quản lý;
- logo;
- con dấu số/thông tin ký số tích hợp;
- timezone;
- locale;
- định dạng ngày;
- thông tin liên hệ;
- tên miền.

## 7.2. Năm học

`CFG-010` Mỗi năm học có:
- mã;
- ngày bắt đầu/kết thúc;
- học kỳ;
- tuần học;
- ngày nghỉ;
- mốc khóa nhập liệu;
- mốc tổng kết;
- trạng thái `PLANNING/ACTIVE/CLOSING/CLOSED/ARCHIVED`.

`CFG-011` Đóng năm học MUST không xóa dữ liệu; chỉ khóa thay đổi thường và chuyển sang quy trình điều chỉnh đặc biệt.

## 7.3. Cấu hình cấp học

Cho phép bật:
- Tiểu học;
- THCS;
- THPT;
- trường nhiều cấp.

Các rule đánh giá phải nạp theo cấp học và năm học.

## 7.4. Feature flags

Feature flag tối thiểu SHOULD có:
- `feature.seating_map`;
- `feature.class_fund`;
- `feature.behavior_ledger`;
- `feature.offline_mode`;
- `feature.server_sync`;
- `feature.android_wrapper`;
- `feature.parent_click_to_call`;
- `feature.word_export`;
- `feature.excel_fast_import`;
- `feature.design_audit_gate`.


Trường có thể bật/tắt:
- điểm danh theo buổi;
- điểm danh theo tiết;
- đơn nghỉ online;
- xác nhận phụ huynh;
- QR attendance (nếu hợp pháp/được phép);
- health module;
- counseling module;
- AI assistant;
- e-signature;
- parent portal;
- student portal;
- mobile push;
- SMS gateway;
- Zalo/OTT connector nếu có tích hợp hợp pháp;
- digital report card;
- data sync connector.

`CFG-020` Mọi feature flag quan trọng MUST có audit và không được làm mất dữ liệu khi tắt.

## 7.5. Workflow Builder

Admin được cấu hình các bước duyệt cho:
- đơn nghỉ;
- khen thưởng;
- sự việc/kỷ luật;
- báo cáo;
- sổ chủ nhiệm tháng;
- điều chỉnh dữ liệu;
- phát hành hồ sơ;
- chia sẻ hồ sơ nhạy cảm.

Workflow node hỗ trợ:
- role approver;
- user cụ thể;
- quorum;
- SLA;
- nhắc việc;
- condition;
- escalation;
- reject-to-step;
- require_comment;
- require_attachment;
- require_signature.

---

# 8. PHÂN HỆ IAM — TÀI KHOẢN, ĐĂNG NHẬP, DANH TÍNH

## IAM-001
Mỗi người dùng có `person_id` và có thể có nhiều assignment/role theo thời gian.

## IAM-002
Không gắn role vĩnh viễn trực tiếp vào user nếu role phụ thuộc năm học/lớp.

## IAM-003 — Đăng nhập
Hỗ trợ:
- username/password;
- SSO OIDC/SAML nếu trường có;
- tài khoản định danh tổ chức;
- MFA cho admin/BGH/người ký;
- service account cho API.

## IAM-004 — Chính sách mật khẩu
Configurable nhưng mặc định:
- tối thiểu 10 ký tự;
- block mật khẩu phổ biến;
- rate limit;
- lockout thích ứng;
- reset token ngắn hạn;
- không gửi mật khẩu rõ qua email/SMS.

## IAM-005 — Session
- session timeout cấu hình;
- revoke tất cả phiên;
- hiển thị thiết bị đang đăng nhập;
- cảnh báo đăng nhập bất thường;
- re-auth cho thao tác nhạy cảm.

## IAM-006 — Lifecycle
`INVITED -> ACTIVE -> SUSPENDED -> DISABLED -> ARCHIVED`.

Khi cán bộ nghỉ/chuyển công tác: disable login nhưng giữ attribution trên audit/hồ sơ cũ.

---

# 9. PHÂN HỆ TỔ CHỨC — ORG & ACADEMIC STRUCTURE

## ORG-001 — Cấu trúc
MUST quản lý:
- cơ sở/campus nếu có;
- cấp học;
- khối;
- lớp;
- tổ chuyên môn;
- tổ văn phòng;
- môn học;
- nhóm hoạt động;
- phòng học tùy chọn.

## ORG-002 — Lớp theo năm học
Không tái sử dụng một record lớp qua năm. Dùng:
- `class_definition`: nhãn logic, ví dụ 8A1;
- `class_instance`: 8A1 của năm 2026-2027.

## ORG-003 — Phân công
`TeachingAssignment` gồm:
- giáo viên;
- môn;
- lớp;
- thời gian hiệu lực;
- vai trò chính/phụ;
- số tiết nếu cần.

`HomeroomAssignment` gồm:
- lớp;
- GVCN;
- GVCN phụ nếu trường dùng;
- ngày bắt đầu/kết thúc;
- quyết định/phê duyệt;
- trạng thái.

## ORG-004
Khi đổi GVCN giữa năm, quyền của giáo viên cũ MUST hết hiệu lực theo ngày; dữ liệu đã tạo vẫn giữ tác giả.

---

# 10. PHÂN HỆ HỒ SƠ CÁN BỘ/GIÁO VIÊN

## STAFF-001 — Hồ sơ cơ bản
- mã cán bộ;
- họ tên;
- ngày sinh nếu cần quản lý;
- thông tin liên hệ công vụ;
- chức danh/vị trí;
- tổ;
- môn;
- trạng thái công tác;
- tài khoản liên kết.

## STAFF-002 — Năng lực/phân công
Có thể quản lý:
- môn có thể dạy;
- cấp học;
- chứng nhận/bồi dưỡng theo nhu cầu;
- phân công chủ nhiệm;
- vai trò kiêm nhiệm.

## STAFF-003
Dữ liệu nhân sự nhạy cảm ngoài nhu cầu giáo dục SHOULD tích hợp từ hệ thống nhân sự, không nhân bản trong nền tảng.

---

# 11. PHÂN HỆ HỒ SƠ HỌC SINH 360°

Đây là master domain quan trọng nhất.

## STU-001 — Định danh
Mỗi học sinh MUST có:
- `student_id` UUID nội bộ bất biến;
- `school_student_code`;
- mã định danh giáo dục nếu có;
- `lifelong_learning_record_id` nếu được cấp/đồng bộ;
- số định danh cá nhân chỉ lưu nếu có căn cứ/quyền phù hợp và phải bảo vệ mạnh.

## STU-002 — Hồ sơ nhân thân
- họ tên pháp lý;
- tên thường dùng nếu cần;
- ngày sinh;
- giới tính theo dữ liệu chính thức;
- nơi sinh/quê quán nếu hồ sơ yêu cầu;
- dân tộc nếu cần cho nghiệp vụ hợp pháp;
- thông tin địa chỉ;
- ảnh hồ sơ;
- trạng thái học sinh.

## STU-003 — Enrollment timeline
Lưu lịch sử:
- nhập học;
- xếp lớp;
- chuyển lớp;
- chuyển trường;
- tạm nghỉ;
- thôi học;
- lên lớp;
- hoàn thành cấp học;
- tốt nghiệp nếu tích hợp.

## STU-004 — Student 360 Tabs

Student 360 SHOULD hiển thị thêm các nhóm dữ liệu phục vụ GVCN nhưng vẫn theo quyền:
- số điện thoại phụ huynh/người giám hộ và quick action gọi điện;
- nguyện vọng/hướng học tập;
- nhu cầu hỗ trợ chỗ ngồi/tiếp cận lớp học;
- health alert tối thiểu cần biết, không hiển thị chẩn đoán chi tiết nếu role không có quyền;
- trạng thái các khoản cần theo dõi nộp/chưa nộp nếu phân hệ tài chính được bật;
- tổng hợp nề nếp theo kỳ dưới dạng hỗ trợ, không gắn nhãn học sinh.

Quick-call:
- Android/PWA hỗ trợ deep link `tel:` khi nền tảng cho phép;
- desktop hiển thị nút sao chép số hoặc tích hợp softphone nếu trường cấu hình;
- không tự ghi âm cuộc gọi;
- việc ghi nhật ký nội dung trao đổi phải là thao tác có chủ đích của người dùng.

Màn hình chi tiết SHOULD gồm:
1. Tổng quan;
2. Học tập;
3. Rèn luyện;
4. Chuyên cần;
5. Hoạt động;
6. Khen thưởng;
7. Sự việc/hỗ trợ;
8. Phụ huynh;
9. Sức khỏe cần biết;
10. Hòa nhập/hỗ trợ đặc thù;
11. Tài liệu;
12. Timeline;
13. Audit access (chỉ người có quyền).

## STU-005 — Timeline
Timeline MUST hợp nhất sự kiện từ nhiều module nhưng chỉ hiển thị item người dùng có quyền xem.

## STU-006 — Hồ sơ “cần quan tâm”
Không gắn nhãn kỳ thị. Hệ thống chỉ dùng:
- `Needs review`;
- `Follow-up required`;
- `Support plan active`.

MUST NOT tự gắn nhãn “cá biệt”, “tâm lý bất thường”, “nguy hiểm”.

## STU-007 — Duplicate detection
Khi import, hệ thống SHOULD phát hiện khả năng trùng bằng mã học sinh/mã định danh và fuzzy matching; merge chỉ khi người có quyền xác nhận.

## STU-008 — Merge
Merge học sinh MUST:
- giữ ID canonical;
- map ID cũ;
- không mất audit;
- không tự merge học bạ đã phát hành;
- tạo merge report.

---

# 12. PHÂN HỆ PHỤ HUYNH / NGƯỜI GIÁM HỘ

## PAR-001 — Guardian entity
Một người giám hộ có thể liên quan nhiều học sinh; một HS có thể nhiều người liên hệ.

Trường dữ liệu:
- tên;
- quan hệ;
- điện thoại;
- email;
- địa chỉ nếu cần;
- ưu tiên liên hệ;
- quyền nhận thông báo;
- quyền xem dữ liệu;
- quyền nộp đơn/xác nhận;
- trạng thái xác minh.

## PAR-002 — Quan hệ và quyền
Không mặc định “có số điện thoại = có toàn quyền”. Relationship MUST có trạng thái xác minh.

## PAR-003 — Parent Portal
Phụ huynh có thể:
- xem thông báo;
- xem chuyên cần của con;
- xem kết quả được công bố;
- gửi đơn nghỉ;
- xác nhận đã đọc;
- đặt lịch/đề nghị trao đổi;
- xem hoạt động;
- tải tài liệu được chia sẻ;
- xem học bạ/trích lục khi được phép;
- cập nhật một số thông tin liên hệ theo workflow.

## PAR-004
Phụ huynh MUST NOT xem ghi chú nội bộ GVCN, ghi chú tư vấn nội bộ, thông tin của học sinh khác hoặc dữ liệu chưa công bố.

---

# 13. PHÂN HỆ QUẢN LÝ LỚP & CHỦ NHIỆM

## CLS-001 — Class cockpit
Mỗi GVCN có dashboard lớp:
- sĩ số;
- vắng hôm nay;
- đi muộn;
- việc chờ xử lý;
- học sinh cần theo dõi;
- sinh nhật;
- hoạt động sắp tới;
- đơn nghỉ;
- deadline;
- cảnh báo dữ liệu thiếu;
- tiến độ sổ chủ nhiệm;
- tiến độ cuối kỳ.

## CLS-002 — Ban cán sự/tổ
Quản lý theo thời gian:
- lớp trưởng;
- lớp phó;
- tổ trưởng;
- cán sự;
- nhiệm kỳ;
- nhiệm vụ;
- lịch sử thay đổi.

## CLS-003 — Sơ đồ chỗ ngồi & chia tổ

Phân hệ này SHOULD là chức năng hàng ngày của GVCN, nhưng dữ liệu bố trí chỗ ngồi không được dùng để suy diễn hành vi tự động.

### CLS-003.1 — Mô hình phòng/lớp

Cho phép cấu hình:
- số dãy/cột;
- số hàng;
- số ghế mỗi bàn;
- vị trí bảng giáo viên;
- cửa ra vào;
- lối đi;
- vị trí đặc biệt/không sử dụng;
- tên khu vực/tổ.

Sơ đồ MUST responsive và hỗ trợ drag & drop trên desktop lẫn touch trên Android.

### CLS-003.2 — Xếp chỗ thủ công

GVCN có thể:
- kéo thả học sinh;
- đổi chỗ 2 học sinh;
- khóa một học sinh tại vị trí;
- khóa một vùng ghế;
- đánh dấu ghế trống;
- undo/redo;
- lưu phiên bản sơ đồ.

### CLS-003.3 — Xếp chỗ 1 chạm

Hệ thống SHOULD hỗ trợ tối thiểu:
1. `RANDOM_SHUFFLE` — xáo trộn ngẫu nhiên;
2. `GROUP_BY_COLUMN` — chia tổ theo dãy/cột;
3. `BALANCE_GROUP_SIZE` — cân bằng số lượng giữa các tổ;
4. `BALANCE_ACADEMIC_BAND` — cân bằng theo dải học lực nếu trường/GVCN được phép dùng dữ liệu này;
5. `CUSTOM_CONSTRAINT_OPTIMIZER` — xếp theo ràng buộc do GVCN chọn.

Trước khi áp dụng, MUST có preview và nút `Áp dụng` / `Hủy`.

### CLS-003.4 — Constraint xếp chỗ

Constraint MAY gồm:
- `FIXED_SEAT`;
- `FRONT_ROW_REQUIRED`;
- `NEAR_BOARD_REQUIRED`;
- `ACCESSIBLE_SEAT_REQUIRED`;
- `HEIGHT_GROUPING` nếu trường muốn;
- `SEPARATE_PAIR` với lý do nghiệp vụ phù hợp;
- `PREFER_PAIR` cho hỗ trợ học tập;
- `DO_NOT_DISCLOSE_REASON` để frontend chỉ thấy ràng buộc, không thấy bệnh lý/chẩn đoán.

Hệ thống SHOULD dùng **derived constraint** thay vì đưa dữ liệu sức khỏe nhạy cảm trực tiếp vào thuật toán.

### CLS-003.5 — Cân bằng học lực không tạo kỳ thị

Nếu bật `BALANCE_ACADEMIC_BAND`:
- dùng band tổng quát do GVCN/Rule Engine cung cấp, không hiển thị điểm chi tiết trên sơ đồ;
- band chỉ dùng trong quá trình tối ưu;
- học sinh/phụ huynh không được thấy nhãn band;
- không tạo nhãn “yếu/kém” trên UI;
- GVCN luôn có quyền điều chỉnh kết quả.

### CLS-003.6 — Lịch sử phiên bản

Mỗi sơ đồ lưu:
- `layout_version_id`;
- ngày áp dụng;
- người tạo;
- thuật toán/phương án;
- random seed nếu dùng random để có thể tái hiện;
- ghi chú;
- ngày kết thúc hiệu lực.

### CLS-003.7 — Chia tổ 1 chạm

Có thể tạo tổ dựa trên:
- dãy/cột chỗ ngồi;
- số tổ mong muốn;
- số HS/tổ tối đa;
- cân bằng số lượng;
- cân bằng band học tập tùy chọn;
- giữ nguyên tổ trưởng/nhân sự khóa nếu được chọn.

Kết quả tạo `ClassGroupMembership` có effective date, không chỉ là chuỗi text trong seat map.

### CLS-003.8 — Xuất Word/PDF sơ đồ lớp

Template engine SHOULD sinh được DOCX/PDF khổ A4:
- dọc hoặc ngang;
- tên trường;
- năm học;
- lớp;
- GVCN;
- sơ đồ bàn ghế;
- họ tên học sinh;
- tên tổ;
- chú thích hướng bảng giáo viên;
- ngày lập;
- vùng chữ ký `Giáo viên chủ nhiệm` và vùng ký khác theo template trường.

DOCX là bản có thể chỉnh sửa; PDF là bản trình bày/đóng dấu nếu cần.

### CLS-003.9 — Offline

Sơ đồ lớp MUST dùng được offline sau khi roster lớp đã được cache hợp lệ. Khi nhiều thiết bị cùng sửa sơ đồ:
- không merge từng ghế một cách im lặng nếu hai layout cùng thay đổi;
- tạo hai version và yêu cầu GVCN chọn/merge nếu phát sinh conflict cùng layout.

## CLS-004 — Student quick action
Từ danh sách lớp có thể:
- xem hồ sơ;
- ghi nhận chuyên cần;
- thêm ghi chú nghiệp vụ;
- tạo follow-up;
- gửi trao đổi phụ huynh;
- tạo đề xuất khen thưởng;
- tạo incident record;
- tạo support referral.

Mọi quick action phải đi vào module nguồn chuẩn tương ứng.

---


# 13A. PHÂN HỆ QUỸ LỚP & MA TRẬN THU — CHI

> Đây là phân hệ **tùy chọn**. Nó hỗ trợ ghi nhận, theo dõi, đối soát và minh bạch các khoản được phép quản lý theo quy định/nội quy của nhà trường. Hệ thống MUST NOT mặc định hợp thức hóa bất kỳ khoản thu nào chỉ vì người dùng tạo được khoản đó.

## FIN-000 — Legal/Policy Guard bắt buộc

Module chỉ được bật khi trường đã cấu hình `finance_policy_profile`. Mỗi campaign phải kiểm tra:
- loại khoản có được phép theo policy hiện hành hay không;
- khoản là tự nguyện hay thuộc một cơ chế thu hợp pháp khác;
- ai là chủ thể quản lý/thu;
- nội dung chi có nằm trong phạm vi cho phép hay không;
- có yêu cầu công khai/quyết toán/phê duyệt nào hay không.

Đối với kinh phí Ban đại diện cha mẹ học sinh theo baseline TT55/2011:
- không tự tạo mức ủng hộ bình quân bắt buộc;
- cần hỗ trợ công khai thu/chi/quyết toán;
- các mục đích bị pháp luật cấm phải có thể cấu hình thành `PROHIBITED_PURPOSE` để chặn tạo giao dịch/campaign.

Rule phải versioned để có thể thay đổi khi văn bản mới thay TT55 được ban hành.

## FIN-001 — Phân biệt “khoản theo dõi” và “quỹ lớp”

Mỗi khoản phải có `financial_item_type`:
- `SCHOOL_AUTHORIZED_COLLECTION_TRACKING`: theo dõi trạng thái nộp cho khoản được nhà trường cho phép/triển khai, ví dụ một số khoản bảo hiểm/dịch vụ theo phạm vi hợp lệ;
- `CLASS_FUND_CONTRIBUTION`: khoản quỹ lớp được phép quản lý;
- `OTHER_TRACKING`: chỉ theo dõi trạng thái, không ghi nhận tiền vào quỹ;
- `EXPENSE`: khoản chi từ quỹ;
- `ADJUSTMENT`;
- `REVERSAL`.

Không gộp mọi khoản thành “quỹ lớp”.

## FIN-002 — Financial campaign / đợt thu

Mỗi đợt có:
- mã đợt;
- lớp/năm học;
- tên khoản;
- loại khoản;
- số tiền chuẩn nếu có;
- cho phép số tiền cá nhân khác nhau hay không;
- ngày bắt đầu;
- hạn nộp;
- đơn vị thu/thụ hưởng;
- căn cứ/ghi chú;
- trạng thái `DRAFT|ACTIVE|CLOSED|CANCELLED`;
- visibility phụ huynh;
- người tạo/phê duyệt nếu workflow yêu cầu.

## FIN-003 — Ma trận thu theo học sinh

UI SHOULD cung cấp ma trận:

```text
Học sinh x Khoản thu
```

Mỗi ô hỗ trợ trạng thái:
- `NOT_DUE`;
- `UNPAID`;
- `PARTIAL`;
- `PAID`;
- `EXEMPT`;
- `NOT_APPLICABLE`;
- `PENDING_RECONCILIATION`;
- `REFUNDED`.

Hiển thị nhanh:
- phải nộp;
- đã nộp;
- còn thiếu;
- ngày nộp gần nhất;
- biên nhận/minh chứng nếu có.

## FIN-004 — Không nhập số dư trực tiếp

Số dư quỹ MUST được tính:

```text
OpeningBalance + Sum(PostedIncome) - Sum(PostedExpense) + Sum(Adjustments)
```

Không có nút “sửa số dư” trực tiếp.

Nếu cần chỉnh sai số:
- tạo `ADJUSTMENT`;
- hoặc `REVERSAL` giao dịch cũ rồi tạo giao dịch đúng.

## FIN-005 — Giao dịch thu

Transaction thu tối thiểu có:
- transaction_id UUID;
- ledger_id;
- campaign_id nếu có;
- student_id nếu liên quan cá nhân;
- payer_name tùy quyền;
- amount;
- currency mặc định `VND`;
- occurred_at;
- recorded_at;
- payment_method: `CASH|TRANSFER|OTHER|UNKNOWN`;
- reference_no;
- receipt/evidence attachment;
- status `DRAFT|POSTED|REVERSED`;
- created_by;
- source_device_id;
- sync status.

## FIN-006 — Giao dịch chi

Transaction chi tối thiểu có:
- category;
- nội dung chi;
- amount;
- occurred_at;
- payee;
- evidence/receipt;
- người đề nghị;
- người ghi nhận;
- người duyệt nếu policy yêu cầu;
- status;
- reversal link nếu điều chỉnh.

## FIN-007 — Danh mục chi

Admin/GVCN theo quyền có thể cấu hình category:
- hoạt động lớp;
- văn phòng phẩm;
- hỗ trợ phong trào;
- khen thưởng;
- khác.

Category có effective date và không xóa cứng nếu đã có giao dịch.

## FIN-008 — Quy trình duyệt tùy chọn

Trường có thể cấu hình:
- giao dịch <= ngưỡng: một người ghi nhận;
- giao dịch > ngưỡng: cần phê duyệt;
- chi bắt buộc có minh chứng;
- đóng sổ theo tháng/học kỳ.

Workflow là cấu hình, không hard-code.

## FIN-009 — Minh bạch

Nếu trường bật parent visibility, phụ huynh chỉ xem dữ liệu được phép:
- danh mục khoản chung;
- số tiền đã ghi nhận của con mình;
- số dư/quỹ tổng hợp nếu policy công khai;
- lịch sử chi đã được công bố.

Phụ huynh MUST NOT xem thông tin nợ/nộp của học sinh khác.

## FIN-010 — Quyền

Permission catalog tối thiểu:
- `finance.view_class_summary`;
- `finance.view_student_status`;
- `finance.create_campaign`;
- `finance.post_income`;
- `finance.post_expense`;
- `finance.reverse_transaction`;
- `finance.approve_transaction`;
- `finance.close_period`;
- `finance.export`;
- `finance.configure`.

Scope tối thiểu: `SCHOOL|GRADE|CLASS|OWN_CHILD`.

## FIN-011 — Offline & sync

Giao dịch tài chính tạo offline:
- được gán UUID trên client;
- vào append-only outbox;
- server xử lý idempotent;
- không hợp nhất hai giao dịch giống nhau chỉ dựa trên số tiền/thời gian;
- duplicate detection dùng `operation_id`, `transaction_id`, reference và heuristic để cảnh báo;
- nếu cùng một giao dịch bị ghi hai lần do người dùng thao tác, phải có workflow đối soát/reversal.

## FIN-012 — Excel

Hỗ trợ:
- import danh sách khoản/ma trận trạng thái từ template;
- export ma trận đã nộp/chưa nộp;
- export sổ thu;
- export sổ chi;
- export đối soát;
- export theo khoảng ngày/học kỳ/năm học.

File export MUST có generated_by/generated_at/trace_id và watermark nếu policy yêu cầu.

## FIN-013 — Báo cáo

Tối thiểu:
- tổng thu;
- tổng chi;
- số dư;
- khoản phải thu còn lại;
- thống kê theo campaign;
- thống kê theo category;
- nhật ký điều chỉnh/đảo giao dịch;
- báo cáo minh bạch phụ huynh theo policy.

## FIN-014 — Không thay thế hệ thống kế toán

Phân hệ này không được tự quảng bá là hệ thống kế toán tài chính chính thức của nhà trường nếu chưa đáp ứng chuẩn/khuôn khổ kế toán áp dụng. Nó là module hỗ trợ quản lý lớp và đối soát theo phạm vi được phê duyệt.

# 14. PHÂN HỆ CHUYÊN CẦN & ĐƠN NGHỈ

## ATT-001 — Kiểu điểm danh
Hỗ trợ cấu hình:
- theo ngày;
- buổi sáng/chiều;
- theo tiết;
- kết hợp.

## ATT-002 — Trạng thái chuẩn
- `PRESENT`
- `ABSENT_EXCUSED`
- `ABSENT_UNEXCUSED`
- `LATE`
- `EARLY_LEAVE`
- `SCHOOL_ACTIVITY`
- `MEDICAL`
- `PENDING_REASON`

Trường có thể thêm display label nhưng mapping chuẩn phải giữ.

## ATT-003 — Nguồn ghi nhận
Lưu:
- ai ghi;
- thời gian;
- phương thức;
- source device/integration;
- reason;
- attachment;
- approval status.

## ATT-004 — Đơn nghỉ
Workflow mẫu:
`DRAFT(parent) -> SUBMITTED -> HOMEROOM_REVIEW -> APPROVED/ESCALATED/REJECTED -> ATTENDANCE_APPLIED`.

## ATT-005 — Giới hạn thẩm quyền
Rule engine SHOULD cấu hình GVCN duyệt nghỉ chính đáng tối đa 03 ngày liên tục theo baseline TT15/2026; vượt giới hạn chuyển cấp có thẩm quyền.

## ATT-006 — Cảnh báo
Cảnh báo configurable:
- vắng X buổi trong Y ngày;
- vắng không phép;
- đi muộn liên tiếp;
- mẫu biến động đột ngột.

Cảnh báo chỉ là tín hiệu cần xem xét, không phải kết luận.

## ATT-007 — Sửa chuyên cần
Sau ngày khóa:
- không sửa trực tiếp;
- tạo `AttendanceCorrectionRequest`;
- có old/new/reason/evidence/approver.

---


# 14A. PHÂN HỆ NHẬT KÝ NỀ NẾP & ĐIỂM QUY ƯỚC NỘI BỘ

## BHV-001 — Mục đích

Ghi nhận nề nếp theo ngày/tuần để GVCN theo dõi, tổng hợp và hỗ trợ giáo dục.

MUST phân biệt:
- `behavior_observation`: ghi nhận sự kiện;
- `behavior_point`: điểm quy ước nội bộ;
- `official_conduct_assessment`: kết quả rèn luyện chính thức ở module Assessment.

Ba lớp dữ liệu này không được nhập nhằng.

## BHV-002 — Event catalog

Trường/GVCN theo quyền có thể cấu hình sự kiện, ví dụ:
- đi học đúng giờ;
- trực nhật tốt;
- hỗ trợ bạn;
- chuẩn bị bài;
- quên đồ dùng;
- đi muộn;
- vi phạm nội quy được ghi nhận.

Mỗi event type có:
- code;
- display_name;
- positive/neutral/negative;
- default_points;
- min/max points;
- requires_note;
- requires_evidence;
- visibility;
- enabled scope;
- effective date.

## BHV-003 — Ghi nhận theo ngày

GVCN/người có quyền có thể ghi nhanh từ roster:
- chọn 1 hoặc nhiều HS;
- chọn loại sự kiện;
- chọn ngày/tiết nếu cần;
- nhập ghi chú;
- đính kèm minh chứng nếu hợp lý;
- lưu offline.

## BHV-004 — Tính điểm tự động

Điểm ngày/tuần/tháng MAY được tính từ ledger:

```text
BehaviorScore(period) = Sum(PostedBehaviorPointEvents)
```

MUST có:
- giới hạn min/max nếu school policy đặt;
- hiển thị giải thích “điểm đến từ các sự kiện nào”;
- không cho sửa tổng điểm trực tiếp;
- correction bằng event điều chỉnh/reversal.

## BHV-005 — Thưởng/phạt là cấu hình nội bộ

Tên gọi trên UI SHOULD ưu tiên trung tính như:
- “ghi nhận tích cực”;
- “nội dung cần cải thiện”;
- “điểm quy ước”.

Không dùng ngôn ngữ làm nhục/kỳ thị học sinh.

## BHV-006 — Không tự động hóa quyết định chính thức

MUST NOT:
- tự xếp loại rèn luyện chỉ từ behavior score;
- tự tạo quyết định kỷ luật;
- tự trừ điểm học tập;
- tự gửi toàn bộ sự kiện nội bộ cho phụ huynh.

Nếu muốn dùng làm nguồn tham khảo cuối kỳ, GVCN phải mở màn hình review, xem nguồn dữ liệu và xác nhận theo quy trình đánh giá chính thức.

## BHV-007 — Báo cáo

Hỗ trợ:
- nhật ký nề nếp theo ngày;
- tổng hợp tuần/tháng;
- thống kê theo event category;
- xu hướng từng học sinh;
- xu hướng lớp;
- export XLSX.

Báo cáo quản trị không được tạo leaderboard tiêu cực công khai.

## BHV-008 — Visibility

Mỗi event có visibility:
- `TEACHER_INTERNAL`;
- `HOMEROOM_TEAM`;
- `STUDENT_VISIBLE`;
- `PARENT_VISIBLE`.

Mặc định event nội bộ là `TEACHER_INTERNAL` trừ khi policy nói khác.

## BHV-009 — Offline conflict

Event ledger là append-only nên các sự kiện độc lập từ nhiều thiết bị có thể hợp nhất bằng union theo UUID.

Nếu hai thiết bị cùng sửa metadata của một event chưa post:
- merge field không xung đột;
- cùng field khác giá trị -> `CONFLICT`;
- event đã `POSTED` -> dùng correction/reversal, không sửa trực tiếp.

# 15. PHÂN HỆ ĐÁNH GIÁ HỌC TẬP & RÈN LUYỆN

## ASM-001 — Rule engine theo cấp học
Hệ thống MUST tách rule:
- `PRIMARY_TT27_2020_*`;
- `SECONDARY_TT22_2021_*`;
- các phiên bản tương lai.

## ASM-002 — Rule effective dating
Mỗi rule:
```yaml
rule_id: string
legal_basis: string
education_level: PRIMARY|LOWER_SECONDARY|UPPER_SECONDARY
effective_from: date
effective_to: date|null
version: semver
status: DRAFT|ACTIVE|RETIRED
```

## ASM-003 — Nguồn điểm/đánh giá
GVBM là nguồn dữ liệu môn mình phụ trách. GVCN được xem/tổng hợp theo quyền nhưng không tự ý sửa dữ liệu môn.

### ASM-003.1 — Gradebook component

Đối với cấp học/môn dùng điểm số, gradebook SHOULD hỗ trợ các nhóm thành phần thường dùng như:
- `TX` — thường xuyên;
- `GK` — giữa kỳ;
- `CK` — cuối kỳ;
- loại khác khi rule version cho phép.

Tên cột, số lần đánh giá, trọng số và công thức MUST đến từ `AssessmentRuleSet` theo cấp học/năm học, không hard-code ở frontend.

### ASM-003.2 — Tính trung bình

Frontend MAY hiển thị ĐTB tạm tính nhưng MUST:
- dùng rule engine hiện hành;
- hiển thị trạng thái `Tạm tính` nếu dữ liệu chưa khóa/đủ;
- không lưu một công thức riêng ở client;
- server và client phải dùng cùng rule version hoặc client chỉ hiển thị kết quả server đã tính;
- lưu `rule_version` đi kèm kết quả snapshot cuối kỳ.

### ASM-003.3 — Nhập nhanh

GVBM có thể:
- paste block từ Excel;
- import XLSX;
- nhập bằng bàn phím theo lưới;
- chuyển ô bằng Enter/Tab;
- validate ngay;
- undo trước khi commit;
- preview thay đổi trước bulk import.

GVCN có thể xem bảng điểm tổng hợp theo quyền nhưng không trở thành owner dữ liệu môn.

## ASM-004 — Locking
Hỗ trợ khóa theo:
- bài kiểm tra;
- kỳ;
- môn;
- lớp;
- deadline.

## ASM-005 — Correction
Sửa sau khóa phải có yêu cầu điều chỉnh.

## ASM-006 — Nhận xét
Nhận xét có:
- author;
- target student;
- subject/activity;
- period;
- visibility: `INTERNAL`, `HOMEROOM`, `PARENT_VISIBLE`, `STUDENT_VISIBLE`, `REPORT_CARD`;
- status.

## ASM-007
MUST NOT cho một nhận xét nội bộ tự động xuất sang phụ huynh/học bạ nếu chưa được chuyển visibility đúng workflow.

## ASM-008 — Cuối kỳ/cuối năm
Hệ thống tạo checklist cho GVCN:
- dữ liệu môn đã đủ?;
- chuyên cần đã khóa?;
- rèn luyện đã hoàn thành?;
- hồ sơ cần xử lý còn mở?;
- đề nghị khen thưởng?;
- danh sách lên lớp/rèn luyện hè?;
- học bạ đủ điều kiện ký?


# 16. PHÂN HỆ HỌC BẠ SỐ

Phân hệ này phải được coi là một miền dữ liệu chính thức, có vòng đời pháp lý riêng.

## HBS-001 — Mô hình dữ liệu
Học bạ MUST lưu dữ liệu có cấu trúc; không lưu PDF làm nguồn duy nhất.

Tối thiểu gồm:
- học sinh;
- mã hồ sơ học tập suốt đời khi có;
- cơ sở giáo dục;
- năm học;
- lớp;
- cấp học;
- kết quả học tập;
- kết quả rèn luyện/phẩm chất/năng lực tùy cấp;
- nhận xét;
- trạng thái lên lớp/hoàn thành;
- chữ ký/xác nhận theo vai trò;
- phiên bản;
- ngày phát hành;
- mã xác thực/truy xuất;
- hash/checksum;
- nguồn dữ liệu.

## HBS-002 — Vòng đời
```text
DRAFT
  -> DATA_VALIDATED
  -> TEACHER_CONFIRMED
  -> HOMEROOM_CONFIRMED
  -> SCHOOL_REVIEWED
  -> SIGNING
  -> SIGNED
  -> PUBLISHED
  -> ARCHIVED
```

Nhánh điều chỉnh:
```text
PUBLISHED -> CORRECTION_REQUESTED -> REVIEWED -> REVOKED/SUPERSEDED -> NEW_VERSION -> SIGNED -> PUBLISHED
```

## HBS-003 — Tạo lập
Hệ thống SHOULD tạo draft theo từng năm học từ dữ liệu nguồn đã được kiểm tra.

## HBS-004 — Validation
Trước khi ký:
- kiểm tra thiếu trường bắt buộc;
- đối chiếu student master;
- đối chiếu lớp/năm học;
- kiểm tra trạng thái đánh giá;
- phát hiện record xung đột;
- kiểm tra chữ ký cần thiết;
- kiểm tra dữ liệu đã khóa.

## HBS-005 — Chữ ký số
Hệ thống MUST hỗ trợ adapter chữ ký điện tử/chữ ký số thay vì khóa cứng một nhà cung cấp.

Interface khuyến nghị:
```text
SigningProvider
- createSigningRequest(document_hash, signer, purpose)
- getSigningStatus(request_id)
- verifySignature(signed_payload)
- revokeOrInvalidate(request_id) [nếu provider hỗ trợ]
```

## HBS-006 — Bản thể hiện
Có thể xuất:
- PDF thể hiện;
- bản điện tử/trích lục theo định dạng được cơ quan có thẩm quyền quy định;
- QR/mã xác thực nếu hợp lệ.

## HBS-007 — Immutability
Bản đã phát hành MUST immutable.

## HBS-008 — Đồng bộ
Connector MUST hỗ trợ:
- push/pull theo batch;
- theo thời gian thực nếu API cho phép;
- retry có idempotency;
- trạng thái sync;
- error queue;
- reconciliation report.

## HBS-009 — Audit
Log tối thiểu:
- người tạo;
- nguồn dữ liệu;
- người xác nhận;
- người ký;
- thời điểm;
- version;
- hash trước/sau;
- hành động tải/xem/chia sẻ;
- endpoint đích khi đồng bộ.

## HBS-010 — Trình tự ký số theo TT70/2026
Workflow ký số MUST biểu diễn được đúng chuỗi nghiệp vụ:
1. hoàn thiện dữ liệu học bạ số;
2. kiểm tra, đối chiếu, xác nhận dữ liệu;
3. ký số của cá nhân có thẩm quyền;
4. ký số của cơ sở giáo dục;
5. cập nhật trạng thái ký số trên hệ thống;
6. chỉ sau khi hợp lệ mới cho phép phát hành.

Các nhóm cá nhân có thể có thẩm quyền ký tùy phần việc/phân công gồm giáo viên môn học, giáo viên phụ trách hoạt động giáo dục, GVCN, người đứng đầu cơ sở giáo dục hoặc người được phân công/ủy quyền hợp lệ. Permission engine MUST không suy ra quyền ký chỉ từ chức danh hiển thị; phải có assignment + signing purpose + hiệu lực.

## HBS-011 — Chữ ký của cơ sở giáo dục
Ngoài chữ ký cá nhân, hệ thống MUST hỗ trợ chữ ký số tổ chức của cơ sở giáo dục để xác nhận trách nhiệm của đơn vị đối với học bạ số do đơn vị tạo lập, quản lý và phát hành.

## HBS-012 — Nhật ký phát hành
Mỗi lần phát hành/bản điện tử/trích lục SHOULD ghi ít nhất:
- thời gian phát hành;
- chủ thể phát hành;
- mục đích phát hành;
- đối tượng nhận;
- version/hash;
- kênh phát hành.

## HBS-013 — Xử lý sai sót
Khi cơ sở giáo dục nhận đủ hồ sơ hợp lệ xác định dữ liệu học bạ số có sai sót, hệ thống SHOULD hỗ trợ SLA pháp lý cấu hình theo TT70/2026; baseline là **không quá 10 ngày làm việc** để xử lý cập nhật hồ sơ theo trách nhiệm của cơ sở giáo dục. SLA engine phải tính ngày làm việc theo lịch cấu hình và lưu thời điểm nhận đủ hồ sơ.

## HBS-014 — Giai đoạn chuyển tiếp
Từ ngày TT70/2026 có hiệu lực, hệ thống cần hỗ trợ:
- tạo lập học bạ số cho người học đang học và người học mới theo lộ trình áp dụng;
- giữ nguyên giá trị hồ sơ giấy đã lập trước thời điểm hiệu lực;
- nhập/số hóa dữ liệu cũ theo lộ trình, không giả định phải số hóa toàn bộ ngay lập tức;
- dùng bản điện tử có xác thực trong trường hợp hệ thống tiếp nhận chưa đủ điều kiện khai thác trực tuyến nếu quy định cho phép.

---

# 17. PHÂN HỆ SỔ CHỦ NHIỆM ĐIỆN TỬ

## HMR-001 — Nguyên tắc
Sổ chủ nhiệm là **một hồ sơ chính thức của GVCN**, nhưng SHOULD được sinh phần lớn từ dữ liệu hệ thống.

## HMR-002 — Cấu trúc đề xuất

### A. Thông tin lớp
- năm học;
- lớp;
- GVCN;
- sĩ số đầu năm;
- biến động sĩ số;
- đặc điểm chung.

### B. Danh sách học sinh
Tự sinh từ enrollment.

### C. Ban cán sự/tổ
Tự sinh từ class roles.

### D. Đặc điểm tình hình
- thuận lợi;
- khó khăn;
- nguồn lực;
- vấn đề cần ưu tiên.

### E. Mục tiêu chủ nhiệm
- mục tiêu học tập;
- rèn luyện;
- chuyên cần;
- hoạt động;
- phối hợp gia đình;
- hỗ trợ học sinh.

### F. Kế hoạch năm/học kỳ/tháng/tuần
Mỗi kế hoạch:
- mục tiêu;
- nội dung;
- thời gian;
- người phụ trách;
- đối tượng;
- kết quả mong đợi;
- minh chứng;
- trạng thái.

### G. Sinh hoạt lớp
- ngày;
- tuần;
- nội dung;
- tình hình chung;
- điểm tích cực;
- vấn đề cần cải thiện;
- ý kiến học sinh;
- nhiệm vụ tuần tới;
- follow-up.

### H. Theo dõi tiến bộ
Chỉ đưa dữ liệu phù hợp, không biến sổ thành nơi sao chép hồ sơ nhạy cảm.

### I. Phối hợp phụ huynh/GVBM
Tự tổng hợp metadata và kết quả được phép đưa vào sổ.

### J. Hoạt động/trải nghiệm
Tự tổng hợp.

### K. Kết quả cuối kỳ/năm
Tự tổng hợp từ assessment engine.

## HMR-003 — Template versioning
Mẫu sổ MUST version theo năm học/cấp học; không hard-code layout duy nhất.

## HMR-004 — Monthly review
Có thể cấu hình GVCN `SUBMIT` sổ theo tháng để BGH/tổ phụ trách `REVIEW/ACKNOWLEDGE` mà không tạo thủ tục thừa nếu trường không yêu cầu.

## HMR-005 — Export
Xuất PDF/DOCX MAY được hỗ trợ; file xuất phải ghi:
- version;
- ngày xuất;
- trạng thái;
- watermark nếu chưa chính thức.

## HMR-006 — End-of-year handover
Cuối năm:
1. hoàn tất;
2. khóa nội dung;
3. bàn giao kho lưu trữ;
4. tạo bản snapshot;
5. gắn retention policy “Hết khóa học” theo TT08/2025.

---

# 18. PHÂN HỆ SINH HOẠT LỚP

## CLS-020
Cho phép tạo agenda trước buổi sinh hoạt:
- tổng kết tuần;
- chuyên cần;
- học tập;
- hoạt động;
- vấn đề cần thảo luận;
- biểu dương;
- kế hoạch tuần tới.

## CLS-021
Học sinh MAY gửi ý kiến trước buổi sinh hoạt theo lựa chọn:
- có tên;
- ẩn danh nội bộ nếu trường cho phép;
- chỉ GVCN xem.

## CLS-022
Biên bản sinh hoạt không được tự động công khai các nội dung cá nhân nhạy cảm.

## CLS-023
Từ biên bản có thể tạo `Task`, `ParentFollowUp`, `SupportReferral`, `ActivityTask`.

---

# 19. PHÂN HỆ GIAO TIẾP VÀ PHỐI HỢP GIÁO VIÊN

## COM-001 — Loại giao tiếp
- announcement;
- direct message;
- class message;
- parent message;
- teacher collaboration note;
- request for input;
- formal notice;
- emergency notice.

## COM-002 — Visibility
Mỗi message có audience rõ ràng. Không dùng group chat tự do làm nguồn hồ sơ chính thức.

## COM-003 — Acknowledgement
Thông báo quan trọng hỗ trợ:
- sent;
- delivered;
- opened;
- acknowledged;
- acknowledged_at.

## COM-004 — GVBM -> GVCN
GVBM có thể gửi `StudentObservation` với:
- học sinh;
- môn;
- loại ghi nhận;
- mức độ ưu tiên;
- mô tả thực tế;
- đề nghị follow-up;
- visibility.

## COM-005
MUST phân biệt “quan sát thực tế” và “nhận định”. UI nên hướng giáo viên nhập dữ kiện cụ thể.

## COM-006 — Lịch sử trao đổi phụ huynh
Một `ContactLog` gồm:
- ai liên hệ;
- ai nhận;
- thời gian;
- kênh;
- mục đích;
- nội dung tóm tắt;
- kết quả;
- follow-up date;
- attachment nếu cần;
- privacy level.

## COM-007
Không lưu ghi âm cuộc gọi mặc định. Nếu triển khai phải có đánh giá pháp lý/quyền riêng tư riêng.

---

# 20. PHÂN HỆ KHEN THƯỞNG

## RWD-001 — Nguồn đề xuất
GVCN/GVBM/người phụ trách hoạt động có thể đề xuất theo quyền.

## RWD-002 — Hồ sơ đề xuất
- student;
- loại thành tích;
- mô tả;
- thời gian;
- minh chứng;
- cấp đề xuất;
- người đề xuất;
- căn cứ;
- trạng thái.

## RWD-003 — Workflow
`DRAFT -> SUBMITTED -> REVIEWED -> APPROVED/REJECTED -> ANNOUNCED -> ARCHIVED`.

## RWD-004
Hệ thống MUST tách:
- ghi nhận tích cực nội bộ;
- biểu dương lớp;
- khen thưởng chính thức.

Không biến mọi ghi nhận thành hồ sơ khen thưởng chính thức.

## RWD-005 — Export
Sinh danh sách/biên bản/quyết định theo template trường nếu trường dùng.

---

# 21. PHÂN HỆ SỰ VIỆC, KỶ LUẬT VÀ GIÁO DỤC HÀNH VI

Thiết kế theo nguyên tắc giáo dục, tôn trọng người học, có minh chứng và quyền được xem xét đúng quy trình.

## DSC-001 — Incident != Discipline
Một sự việc được ghi nhận không đồng nghĩa với quyết định kỷ luật.

## DSC-002 — Incident record
- mã vụ việc;
- ngày/giờ;
- địa điểm;
- người báo cáo;
- học sinh liên quan;
- mô tả sự kiện;
- nhân chứng nếu có;
- attachment;
- mức độ ban đầu;
- an toàn khẩn cấp?;
- người được phân công;
- trạng thái.

## DSC-003 — State machine
```text
REPORTED
 -> TRIAGED
 -> INFORMATION_GATHERING
 -> STUDENT_MEETING
 -> PARENT_COORDINATION
 -> EDUCATIONAL_MEASURE
 -> DISCIPLINE_REVIEW (nếu cần)
 -> DECIDED
 -> FOLLOW_UP
 -> CLOSED
```

## DSC-004 — Due process data
Nếu đi đến xử lý chính thức, hồ sơ SHOULD chứa:
- thông tin đã xác minh;
- ý kiến học sinh;
- ý kiến phụ huynh khi phù hợp;
- biện pháp đã thực hiện;
- người quyết định;
- căn cứ;
- quyết định;
- thời hạn/theo dõi;
- kết quả sau xử lý.

## DSC-005 — Privacy
Incident mặc định `SENSITIVE`; vụ nghiêm trọng có thể `SEALED_CASE`.

## DSC-006 — No permanent stigma
Dashboard thường ngày MUST NOT hiển thị nhãn “học sinh vi phạm” kéo dài sau khi case đóng nếu không cần thiết.

## DSC-007 — Retention
Hồ sơ khen thưởng/kỷ luật học sinh phổ thông MUST map retention theo TT08/2025 và loại hồ sơ; rule engine không hard-code ngoài policy catalog.

---

# 22. PHÂN HỆ TƯ VẤN HỌC ĐƯỜNG & CÔNG TÁC XÃ HỘI

Căn cứ nghiệp vụ chính: TT18/2025/TT-BGDĐT.

## CNS-001 — Referral
Nguồn chuyển giới thiệu:
- GVCN;
- GVBM;
- phụ huynh;
- học sinh tự yêu cầu;
- BGH;
- hệ thống cảnh báo chỉ **đề xuất xem xét**.

## CNS-002 — Referral record
- lý do;
- dữ kiện quan sát;
- mức khẩn;
- người giới thiệu;
- quyền chia sẻ;
- consent/legal basis metadata khi cần;
- trạng thái.

## CNS-003 — Triage
`NEW -> TRIAGED -> ASSIGNED -> ACTIVE -> FOLLOW_UP -> CLOSED`.

## CNS-004 — Case confidentiality
Case note chuyên môn SHOULD chỉ tư vấn viên/người được chỉ định xem. GVCN chỉ thấy:
- trạng thái cần phối hợp;
- hướng dẫn cần thiết;
- thông tin được chia sẻ có chủ đích.

## CNS-005 — Safety escalation
Cho phép đánh dấu `IMMEDIATE_SAFETY_CONCERN` để chuyển workflow khẩn cấp theo quy trình trường. Phần mềm không tự đưa chẩn đoán.

## CNS-006 — Support plan
- mục tiêu;
- biện pháp;
- người phối hợp;
- mốc review;
- kết quả;
- trạng thái.

## CNS-007 — Case note
Case note không được xuất chung trong sổ chủ nhiệm hoặc báo cáo lớp mặc định.

## CNS-008 — Directory
Có danh bạ nguồn hỗ trợ nội bộ/bên ngoài do trường quản lý, với quyền truy cập phù hợp.

---

# 23. PHÂN HỆ HỌC SINH CẦN HỖ TRỢ / EARLY REVIEW

## CNS-020 — Rule signals
Rule engine MAY phát tín hiệu từ:
- chuyên cần;
- kết quả học tập;
- số observation của GVBM;
- task follow-up quá hạn;
- biến động đột ngột.

## CNS-021
Mỗi signal MUST hiển thị lý do định lượng/rõ ràng, ví dụ:
“Vắng 4 buổi trong 14 ngày” thay vì “Nguy cơ cao”.

## CNS-022
Không sử dụng score mờ đục để tự quyết định kỷ luật hoặc xếp loại.

## CNS-023 — Review queue
GVCN có queue:
- signal;
- xem dữ liệu nguồn;
- dismiss with reason;
- create follow-up;
- contact parent;
- refer support;
- snooze.

## CNS-024
Dismiss không xóa dữ liệu nguồn; chỉ đóng signal.

---

# 24. PHÂN HỆ HÒA NHẬP / NHU CẦU GIÁO DỤC ĐẶC THÙ

## INC-001
Mô-đun này mặc định `SENSITIVE`.

## INC-002 — Dữ liệu
Tùy nhu cầu/hồ sơ hợp pháp:
- loại hỗ trợ;
- điều chỉnh cần thiết trong học tập;
- kế hoạch hỗ trợ;
- người phối hợp;
- tài liệu;
- lịch review;
- bàn giao khi chuyển cấp/chuyển trường.

## INC-003
GVBM chỉ cần thấy “accommodation/instruction cần thiết” chứ không nhất thiết thấy toàn bộ hồ sơ.

## INC-004
Khi chuyển trường/cấp, workflow bàn giao phải ghi:
- dữ liệu nào bàn giao;
- người bàn giao;
- người nhận;
- thời gian;
- xác nhận.

---

# 25. PHÂN HỆ SỨC KHỎE HỌC SINH

## HLT-001 — Nguyên tắc tối thiểu
Nền tảng chủ nhiệm chỉ lưu hoặc tích hợp thông tin sức khỏe **cần cho an toàn/học tập**, không biến thành HIS y tế.

## HLT-002 — Health alert
Ví dụ:
- dị ứng quan trọng;
- tình trạng cần chú ý trong hoạt động;
- thuốc/can thiệp chỉ nếu có quy trình hợp lệ;
- liên hệ khẩn cấp.

## HLT-003 — Layered visibility
- GVBM: chỉ cảnh báo cần biết;
- GVCN: cảnh báo + hướng dẫn;
- y tế: chi tiết được phân quyền;
- admin kỹ thuật: không mặc định xem.

## HLT-004
Mọi truy cập chi tiết sức khỏe SHOULD được audit.

---

# 26. PHÂN HỆ HOẠT ĐỘNG TRẢI NGHIỆM, HƯỚNG NGHIỆP, NGOẠI KHÓA

## ACT-001 — Activity master
- tên;
- loại;
- mục tiêu;
- thời gian;
- địa điểm;
- đối tượng;
- người phụ trách;
- capacity;
- yêu cầu đồng ý PHHS nếu có;
- risk/safety plan metadata;
- tài liệu.

## ACT-002 — Participant
Theo dõi:
- invited;
- registered;
- consented;
- attended;
- absent;
- completed.

## ACT-003 — Permission/consent
Hoạt động cần xác nhận phụ huynh phải có e-acknowledgement workflow; chữ ký điện tử nếu pháp lý/quy trình yêu cầu.

## ACT-004 — Reflection/outcome
Có thể lưu kết quả/nhận xét hoạt động được phép dùng cho hồ sơ giáo dục.

## ACT-005 — Hướng nghiệp
Cho phép quản lý:
- sự kiện hướng nghiệp;
- khảo sát sở thích (không chẩn đoán);
- kế hoạch cá nhân;
- tài nguyên;
- lịch tư vấn.

---

# 27. PHÂN HỆ ĐOÀN/ĐỘI, PHONG TRÀO, CÂU LẠC BỘ

## ACT-020
Quản lý:
- kế hoạch hoạt động;
- thành viên;
- vai trò;
- điểm danh;
- thành tích;
- nhiệm vụ;
- minh chứng;
- báo cáo.

## ACT-021
Không ép dữ liệu phong trào thành điểm rèn luyện nếu rule pháp lý/nội bộ không quy định.

---

# 28. PHÂN HỆ LỊCH, NHIỆM VỤ VÀ DEADLINE

## TASK-001 — Unified Task
Task có:
- title;
- description;
- assignee;
- watcher;
- due date;
- priority;
- linked resource;
- status;
- checklist;
- attachment;
- reminder;
- escalation.

## TASK-002 — Nguồn task
Task có thể sinh từ:
- workflow;
- báo cáo thiếu;
- follow-up HS;
- trao đổi phụ huynh;
- case;
- hoạt động;
- cuối kỳ;
- sổ chủ nhiệm.

## TASK-003 — Dashboard
Mỗi người dùng thấy:
- hôm nay;
- quá hạn;
- 7 ngày tới;
- chờ người khác;
- cần phê duyệt.

## TASK-004 — Calendar
Calendar hợp nhất:
- lịch trường;
- lịch lớp;
- lịch hoạt động;
- lịch họp;
- deadline;
- lịch cá nhân.

## TASK-005
Calendar item nhạy cảm chỉ hiển thị nhãn chung nếu người dùng không có quyền xem detail.

---

# 29. PHÂN HỆ HỌP PHỤ HUYNH & LÀM VIỆC VỚI PHHS

## PAR-020 — Meeting
- lớp;
- thời gian;
- agenda;
- tài liệu;
- attendance phụ huynh;
- biên bản;
- nội dung chung;
- action items.

## PAR-021 — Individual meeting
Cuộc làm việc cá nhân:
- học sinh;
- người tham gia;
- mục đích;
- nội dung tóm tắt;
- cam kết/thống nhất;
- follow-up;
- attachment;
- confidentiality.

## PAR-022
Biên bản cá nhân MUST không lẫn vào biên bản chung của lớp.

---

# 30. PHÂN HỆ BÁO CÁO & DASHBOARD

## RPT-001 — Dashboard GVCN
- sĩ số;
- chuyên cần;
- dữ liệu thiếu;
- follow-up;
- lịch;
- signal cần xem;
- tiến độ hồ sơ.

## RPT-002 — Dashboard GVBM
- lớp/môn;
- dữ liệu đánh giá thiếu;
- deadline;
- observation cần follow-up;
- yêu cầu từ GVCN/BGH.

## RPT-003 — Dashboard BGH
- chuyên cần toàn trường;
- tiến độ nhập/khóa dữ liệu;
- tình trạng học bạ;
- sổ chủ nhiệm;
- case mở theo mức tổng hợp;
- hoạt động;
- workflow quá hạn;
- thống kê sử dụng hệ thống.

## RPT-004 — Dashboard tổ trưởng
Chỉ dữ liệu trong phạm vi tổ/phân công.

## RPT-005 — Dashboard phụ huynh
Chỉ con mình và dữ liệu đã công bố.

## RPT-006 — Bộ báo cáo chuẩn

Bộ báo cáo chuẩn SHOULD bổ sung:
- sơ đồ lớp/chia tổ hiện hành;
- chuyên cần theo ngày/tuần/tháng;
- nề nếp theo ngày/tuần/tháng;
- ma trận khoản thu đã nộp/chưa nộp;
- sổ thu/sổ chi quỹ lớp;
- đối soát quỹ;
- bảng điểm thành phần/ĐTB theo quyền;
- danh sách thông tin liên hệ phụ huynh theo scope;
- báo cáo trạng thái offline/sync/conflict cho admin CNTT.

Tối thiểu:
1. danh sách lớp;
2. biến động sĩ số;
3. chuyên cần ngày/tuần/tháng/kỳ;
4. vắng không phép;
5. đi muộn;
6. tổng hợp đánh giá lớp;
7. tiến độ hoàn tất đánh giá;
8. học sinh lên lớp/không lên lớp/rèn luyện hè theo rule;
9. khen thưởng;
10. hồ sơ sự việc/kỷ luật theo quyền;
11. hoạt động trải nghiệm;
12. phối hợp phụ huynh;
13. tình trạng hồ sơ lưu trữ;
14. tiến độ học bạ số;
15. báo cáo chủ nhiệm tháng/kỳ/năm;
16. danh sách dữ liệu thiếu;
17. báo cáo audit theo tài khoản;
18. báo cáo access dữ liệu nhạy cảm.

## RPT-007 — Report builder
Admin MAY tạo report tùy chỉnh từ semantic layer, không cho query SQL trực tiếp từ UI.

## RPT-008 — Export control
Export MUST kiểm tra quyền riêng, không mặc định vì user có `VIEW` là có `EXPORT`.

## RPT-009 — Watermark
File chứa dữ liệu cá nhân SHOULD có:
- người xuất;
- thời gian;
- mã truy vết;
- watermark phù hợp.

---

# 31. PHÂN HỆ HỒ SƠ/TÀI LIỆU ĐIỆN TỬ

## DOC-001 — Document metadata
- document_id;
- document_type;
- title;
- owner unit;
- school_year;
- linked student/class/user;
- classification;
- status;
- version;
- created_by;
- approved_by;
- signed_by;
- retention_policy_id;
- archive_status;
- checksum;
- storage_uri.

## DOC-002 — Versioning
File thay thế MUST tạo version mới, không overwrite im lặng.

## DOC-003 — Status
`DRAFT -> IN_REVIEW -> APPROVED -> SIGNED -> PUBLISHED -> SUPERSEDED -> ARCHIVED`.

## DOC-004 — Attachment
- whitelist định dạng;
- antivirus/malware scan;
- file size limit;
- content-type validation;
- hash;
- download audit cho file nhạy cảm.

## DOC-005 — Generated documents
Các tài liệu sinh tự động phải lưu:
- template version;
- data snapshot/version;
- generation time;
- generator version.

## DOC-006 — Template engine

Template engine MUST hỗ trợ tối thiểu:
- DOCX editable;
- PDF;
- XLSX;
- A4 portrait/landscape;
- header/footer;
- vùng chữ ký;
- bảng động;
- repeat row;
- page break;
- font tiếng Việt;
- template theo trường/năm học/version.

Use case bắt buộc: xuất sơ đồ chỗ ngồi A4 có vùng chữ ký GVCN.

Template hỗ trợ placeholders có schema, ví dụ:
`{{student.full_name}}`, `{{class.name}}`, `{{school_year.label}}`.

Template không được chứa code thực thi tùy ý.

---

# 32. PHÂN HỆ LƯU TRỮ VÀ RETENTION ENGINE

## ARC-001 — Policy catalog
Mỗi loại hồ sơ gắn:
```yaml
retention_policy_id: ARC-POL-XXX
legal_basis: "TT08/2025/TT-BGDĐT"
effective_from: 2025-07-01
effective_to: null
trigger: "COURSE_END|STUDENT_TRANSFER|RECORD_CLOSE|CREATION_DATE|CUSTOM"
duration: "5Y|10Y|20Y|PERMANENT|UNTIL_COURSE_END|RETURN_TO_STUDENT|HANDOVER"
disposition: "ARCHIVE|RETURN|HANDOVER|DESTROY_REVIEW"
```

## ARC-002 — Baseline phổ thông cần cấu hình
Theo TT08/2025, catalog tối thiểu phải bao gồm:

### Tiểu học
- Sổ đăng bộ: **Vĩnh viễn**.
- Bảng tổng hợp kết quả đánh giá giáo dục của lớp: **10 năm**.
- Hồ sơ khen thưởng, kỷ luật học sinh: **10 năm**.
- Học bạ học sinh: **Trả học sinh khi ra trường/chuyển trường** theo danh mục lưu trữ.
- Hồ sơ giáo dục HS khuyết tật: **Bàn giao cho cơ sở giáo dục mới khi chuyển trường/cấp học**.
- Sổ phổ cập giáo dục tiểu học: **10 năm**.
- Sổ chủ nhiệm: **Hết khóa học**.
- Sổ công tác Đội: **Hết khóa học**.

### THCS/THPT/trường nhiều cấp/chuyên biệt
- Sổ đăng bộ: **Vĩnh viễn**.
- Sổ theo dõi HS chuyển đi/chuyển đến: **05 năm**.
- Sổ gọi tên và ghi điểm: **Vĩnh viễn**.
- Sổ nghị quyết trường/hội đồng trường: **10 năm**.
- Học bạ: **Trả HS khi ra trường/chuyển trường** theo danh mục.
- Hồ sơ khen thưởng, kỷ luật HS: **10 năm**.
- Hồ sơ giáo dục HS khuyết tật: **10 năm**.
- Sổ phổ cập giáo dục: **20 năm**.
- Sổ ghi đầu bài: **Hết khóa học**.
- Sổ chủ nhiệm: **Hết khóa học**.

## ARC-003
Retention engine MUST không tự xóa khi đến hạn. Trước disposition phải tạo review queue và kiểm tra legal hold.

## ARC-004 — Legal hold
Cho phép tạm dừng tiêu hủy vì:
- thanh tra/kiểm tra;
- tranh chấp;
- yêu cầu cơ quan có thẩm quyền;
- vụ việc đang xử lý.

## ARC-005 — Archive package
Gói lưu trữ SHOULD gồm:
- file;
- metadata;
- checksum;
- chữ ký;
- audit summary;
- manifest.

## ARC-006 — Restore
Restore từ archive không được thay đổi bản gốc; tạo working copy/link có audit.

## ARC-007 — Hồ sơ học tập suốt đời
Dữ liệu hồ sơ học tập suốt đời trong CSDL quốc gia về giáo dục và đào tạo có baseline lưu giữ **vĩnh viễn** theo NĐ88/2026. Hệ thống trường không được suy luận rằng mọi bản sao cục bộ cũng phải giữ vô hạn; phải phân biệt:
- dữ liệu nguồn/record do trường có nghĩa vụ lưu;
- dữ liệu đồng bộ/cache;
- dữ liệu thuộc hồ sơ học tập suốt đời quốc gia.
Retention catalog MUST ghi rõ chủ quản và nguồn pháp lý của từng bản sao.

---

# 33. PHÂN HỆ QUẢN TRỊ DỮ LIỆU / DATA GOVERNANCE

## 33.1. Data Owner
Mỗi domain phải có owner nghiệp vụ:
- Student Master → Ban giám hiệu/văn phòng theo quy chế trường;
- Assessment → bộ phận chuyên môn/GV được phân công;
- Attendance → lớp/GV theo cơ chế điểm danh;
- Homeroom → GVCN;
- Counseling → bộ phận tư vấn;
- Health → y tế;
- Record Archive → văn thư/lưu trữ.

## 33.2. Data Steward
Cấu hình người chịu trách nhiệm chất lượng dữ liệu, không nhất thiết là người sở hữu nghiệp vụ.

## 33.3. Data quality rules
- completeness;
- uniqueness;
- validity;
- referential integrity;
- timeliness;
- consistency;
- legal state consistency.

## 33.4. Data issue workflow
`DETECTED -> ASSIGNED -> INVESTIGATING -> FIX_PROPOSED -> VERIFIED -> CLOSED`.

## 33.5. Reconciliation
Mỗi connector quan trọng MUST có báo cáo:
- local count;
- remote count;
- matched;
- conflict;
- missing local;
- missing remote;
- failed sync.

---

# 34. PHÂN HỆ THÔNG BÁO

## COM-020 — Channel
- in-app;
- push;
- email;
- SMS optional;
- external approved gateway optional.

## COM-021 — Notification preference
User cấu hình preference nhưng thông báo pháp lý/khẩn cấp có thể có channel bắt buộc theo policy.

## COM-022 — Template
Notification template có biến, locale, version.

## COM-023 — No sensitive leakage
Push notification không nên chứa dữ liệu nhạy cảm trên màn hình khóa. Ví dụ chỉ hiển thị “Bạn có một thông báo mới từ nhà trường”.

## COM-024 — Digest
Hỗ trợ daily/weekly digest để giảm spam.

---

# 35. TRỢ LÝ AI

## AI-001 — Mục tiêu
AI dùng để:
- tóm tắt dữ liệu đã được phép;
- gợi ý nhận xét;
- gợi ý kế hoạch chủ nhiệm;
- soạn thông báo;
- tóm tắt cuộc họp từ ghi chú văn bản;
- phát hiện dữ liệu thiếu;
- giải thích báo cáo;
- tìm tài liệu/quy định nội bộ;
- đề xuất follow-up dựa trên rule minh bạch.

## AI-002 — Cấm tự quyết
AI MUST NOT tự:
- phát hành học bạ;
- ký số;
- sửa điểm;
- xếp loại chính thức;
- phê duyệt nghỉ;
- ra quyết định kỷ luật;
- chẩn đoán tâm lý/y khoa;
- gửi nội dung nhạy cảm cho PHHS;
- xóa hồ sơ;
- mở rộng quyền truy cập.

## AI-003 — Data scope
AI chỉ nhận dữ liệu mà user hiện tại có quyền xem và chỉ phần cần cho tác vụ.

## AI-004 — Prompt logging
Không bắt buộc lưu toàn bộ prompt nếu chứa dữ liệu nhạy cảm. Nên lưu metadata an toàn:
- user;
- feature;
- model/provider;
- time;
- data categories;
- output accepted/rejected.

## AI-005 — Human approval
Mọi nội dung AI chuẩn bị để trở thành record chính thức phải được người dùng xem/sửa/xác nhận.

## AI-006 — Explainability
Nếu AI nêu “cần theo dõi”, phải chỉ ra dữ liệu nguồn; không dùng điểm rủi ro bí mật.

## AI-007 — Provider abstraction
Kiến trúc:
```text
AIService
 -> PolicyGuard
 -> DataMinimizer
 -> ContextBuilder
 -> ProviderAdapter
 -> OutputValidator
 -> HumanReview
```

## AI-008 — Opt-out
School admin có thể tắt AI toàn trường hoặc theo module.

## AI-009 — Sensitive domains
Counseling/health/SEALED_CASE mặc định không gửi sang provider AI bên ngoài trừ khi có cấu hình, đánh giá pháp lý và cơ chế bảo vệ dữ liệu phù hợp.

---

# 36. TÌM KIẾM TOÀN HỆ THỐNG

## CORE-030
Search hỗ trợ:
- học sinh;
- lớp;
- giáo viên;
- tài liệu;
- nhiệm vụ;
- hoạt động.

## CORE-031
Kết quả search MUST lọc theo quyền trước khi trả về. Không được search xong rồi ẩn ở frontend.

## CORE-032
Không index plaintext dữ liệu nhạy cảm vào search engine không được bảo vệ tương đương DB chính.

---

# 37. NHẬP/XUẤT DỮ LIỆU

## INT-001 — Import
Hỗ trợ CSV/XLSX có template version.

Use case ưu tiên: GVCN tải danh sách lớp từ Excel và đưa vào hệ thống mà không phải nhập lại.

Import SHOULD hỗ trợ:
- drag & drop;
- chọn sheet;
- tự nhận diện hàng header;
- map cột tự động theo alias tiếng Việt;
- cho người dùng sửa mapping;
- lưu `ImportMappingProfile` để lần sau dùng lại;
- chuẩn hóa ngày sinh, giới tính, số điện thoại, mã học sinh;
- preview tối thiểu 20 dòng;
- highlight lỗi ngay tại ô;
- tải về file lỗi có cột mô tả;
- dry-run trước commit;
- duplicate detection theo mã định danh + rule phụ trợ;
- upsert chỉ khi người dùng chọn rõ policy.

Import process:
1. upload;
2. virus scan;
3. parse;
4. validate schema;
5. preview;
6. duplicate detection;
7. error report;
8. confirm;
9. commit transaction/batch;
10. audit.

## INT-002
Không commit partial im lặng. Phải báo record thành công/thất bại rõ ràng.

## INT-002A — Fast roster import

Wizard nhập danh sách lớp SHOULD có chế độ 4 bước:
`Chọn file -> Ghép cột -> Kiểm tra -> Xác nhận`.

Mục tiêu UX: một file hợp lệ có thể hoàn thành import trong <= 60 giây thao tác người dùng, không tính thời gian upload/parse file lớn.

## INT-003 — Export
Mọi export có:
- filter;
- data scope;
- file format;
- generated_by;
- generated_at;
- trace_id.

## INT-004
CSV export MUST chống formula injection bằng escape cell bắt đầu `=`, `+`, `-`, `@` nếu dữ liệu người dùng nhập.

---

# 38. KIẾN TRÚC TÍCH HỢP

## 38.1. Integration Gateway
Không để từng module gọi trực tiếp hệ thống ngoài. Dùng:
```text
Domain Service -> Integration Gateway -> Adapter -> External System
```

## 38.2. Adapter dự kiến
- CSDL ngành/CSDL giáo dục;
- học bạ số;
- chữ ký số;
- SSO;
- email;
- SMS;
- push;
- LMS;
- thời khóa biểu;
- phần mềm điểm;
- HR;
- data warehouse.

## INT-010 — Idempotency
Mọi API write ra ngoài SHOULD dùng idempotency key.

## INT-011 — Retry
Exponential backoff + dead-letter queue.

## INT-012 — Sync state
Mỗi entity đồng bộ lưu:
- external_id;
- last_sync_at;
- sync_version;
- status;
- last_error;
- checksum.

## INT-013 — Conflict
Conflict không tự overwrite. Có policy:
- source wins;
- local wins;
- newest wins (chỉ dữ liệu không nhạy cảm/không chính thức);
- manual review.

## INT-014
Dữ liệu học bạ chính thức MUST không dùng “newest wins” đơn giản.

---


# 38A. KIẾN TRÚC OFFLINE-FIRST & ĐỒNG BỘ HAI CHIỀU

## SYNC-001 — Hai chế độ triển khai

Ứng dụng MUST hỗ trợ:

### Chế độ A — Local Only
- không cần server;
- dữ liệu lưu trên thiết bị;
- đủ dùng cho GVCN/GV trong phạm vi dữ liệu đã được cấp/cài đặt;
- backup/export cục bộ;
- hiển thị rõ “Chưa kết nối máy chủ”.

### Chế độ B — Connected School
- admin cấu hình server;
- thiết bị đăng ký với school tenant;
- tự sync khi có mạng;
- có push/pull incremental;
- conflict workflow;
- server làm canonical coordination point nhưng không làm mất thay đổi local hợp lệ.

Ứng dụng MUST cho phép bắt đầu ở Local Only và **liên kết server về sau** bằng migration/link wizard.

## SYNC-002 — Local data store abstraction

Frontend không truy cập IndexedDB/SQLite trực tiếp từ component.

Kiến trúc:
```text
UI
 -> Domain Use Case
 -> Local Repository Interface
 -> Local Storage Adapter
 -> Change Journal / Outbox
 -> Sync Engine
```

Adapter có thể khác theo nền tảng nhưng domain contract phải giống nhau.

## SYNC-003 — Local database

Local store tối thiểu có:
- entity cache;
- local mutation/outbox;
- inbox/applied remote operation registry;
- sync cursor;
- conflict table;
- attachment queue metadata;
- device metadata;
- local encryption metadata.

## SYNC-004 — Mutation envelope

Mọi thay đổi đồng bộ dùng envelope tương tự:

```yaml
operation_id: uuid
entity_type: student|attendance|behavior_event|finance_transaction|...
entity_id: uuid
operation_type: CREATE|PATCH|DELETE|REVERSAL|COMMAND
base_version: integer|null
field_patch:
  guardian_phone: "..."
client_created_at: instant
device_id: uuid
actor_id: uuid
school_id: uuid
academic_year_id: uuid|null
schema_version: integer
```

Không gửi nguyên whole-row nếu chỉ đổi một vài field trừ trường hợp snapshot domain yêu cầu.

## SYNC-005 — Idempotency

Server MUST lưu/nhận biết `operation_id` đã xử lý.

Nếu client retry cùng operation:
- server trả kết quả cũ;
- không tạo duplicate transaction/event.

## SYNC-006 — Push/Pull sequence

Chu kỳ sync chuẩn:
1. kiểm tra server health/auth;
2. push outbox batch theo thứ tự phụ thuộc;
3. server validate permission + version + business rule;
4. server commit + trả canonical version;
5. client mark outbox applied;
6. client pull remote changes từ `sync_cursor`;
7. apply vào local store;
8. detect/record conflict;
9. cập nhật cursor;
10. phát UI event `sync.completed`.

Nếu push một operation thất bại do validation, các operation không phụ thuộc SHOULD vẫn có thể tiếp tục; lỗi phải rõ theo từng operation.

## SYNC-007 — Conflict classification

Conflict phải được phân loại:
- `NO_CONFLICT_DIFFERENT_FIELDS`;
- `SAME_FIELD_CONFLICT`;
- `DELETE_VS_UPDATE`;
- `LOCKED_RECORD_CONFLICT`;
- `PERMISSION_CHANGED`;
- `WORKFLOW_STATE_CONFLICT`;
- `DUPLICATE_SUSPECTED`;
- `SCHEMA_VERSION_CONFLICT`.

## SYNC-008 — Merge khác field

Ví dụ base:
```yaml
phone: "0901"
address: "A"
```

PC offline sửa:
```yaml
phone: "0902"
```

Android offline sửa:
```yaml
address: "B"
```

Kết quả SHOULD là:
```yaml
phone: "0902"
address: "B"
```

Nếu policy/permission hợp lệ.

## SYNC-009 — Cùng field khác giá trị

Nếu cùng field bị sửa ở hai phía sau cùng base version:
- không silent overwrite với dữ liệu quan trọng;
- tạo conflict record;
- hiển thị `Giá trị thiết bị`, `Giá trị server`, `Giá trị gốc`;
- cho người có quyền chọn một giá trị hoặc nhập giá trị merged;
- audit quyết định.

## SYNC-010 — Conflict policy matrix theo domain

| Domain | Kiểu merge mặc định |
|---|---|
| Student contact field | Field-level merge; same field -> manual review |
| Guardian relation | Entity-level merge + duplicate detection |
| Attendance | Composite slot; same slot khác trạng thái -> manual/correction workflow |
| Behavior event | Append union theo UUID; posted event không edit |
| Finance ledger | Append union theo UUID; duplicate suspected -> reconciliation, không collapse tự động |
| Assessment | Owner/source + version lock; conflict -> correction workflow |
| Seating layout | Versioned whole layout; concurrent layouts -> choose/merge explicitly |
| Homeroom notes | Versioned text; concurrent same note -> three-way merge/manual |
| Official report card | Không auto merge sau lock/sign; correction workflow |
| Configuration | Versioned admin change; same key conflict -> admin review |

## SYNC-011 — Tombstone & delete

Soft delete/tombstone có:
- deleted_at;
- deleted_by;
- delete_operation_id;
- retention disposition state.

Client không xóa local record ngay khi chưa chắc delete đã được server chấp nhận nếu record cần đồng bộ.

## SYNC-012 — Attachment sync

File/ảnh không nhét trực tiếp vào operation JSON lớn.

Quy trình:
1. tạo attachment metadata local;
2. hash file;
3. upload resumable khi online;
4. server verify hash;
5. link attachment vào entity;
6. mark synced.

Offline cache file nhạy cảm phải theo policy và có expiry.

## SYNC-013 — Clock & timezone

Không dùng `device current time` làm bằng chứng duy nhất cho thứ tự canonical.

Lưu:
- `client_created_at`;
- `server_received_at`;
- `server_committed_at`;
- `device_clock_offset_estimate` nếu có.

UI hiển thị theo `Asia/Ho_Chi_Minh` mặc định.

## SYNC-014 — Server connection configuration

Admin UI MUST có trang **Kết nối & Đồng bộ**:
- `server_base_url`;
- `tenant/school_id`;
- API version;
- authentication mode;
- device registration;
- auto-sync enabled;
- sync interval;
- sync on app start;
- sync when network regained;
- Wi-Fi only cho attachment tùy chọn;
- batch size;
- attachment max size;
- retry policy;
- conflict policy profile;
- certificate/TLS status;
- last successful sync;
- last error;
- `Đồng bộ ngay`;
- `Kiểm tra kết nối`.

Credential/token MUST lưu trong secure storage phù hợp nền tảng, không plaintext trong config file.

## SYNC-015 — Link local installation to server later

Wizard bắt buộc:
1. backup local;
2. nhập cấu hình server;
3. xác thực trường/người dùng;
4. tải metadata tenant;
5. đối chiếu academic year/class/student identifiers;
6. phát hiện duplicate;
7. preview dữ liệu local-only vs server-only vs both;
8. chọn merge policy theo domain;
9. dry-run;
10. commit batches;
11. reconciliation report;
12. chuyển sang connected mode.

Không được upload “tất cả local rồi ghi đè server”.

## SYNC-016 — Device identity

Mỗi cài đặt có `device_id` ngẫu nhiên riêng.

Server lưu:
- user/device mapping;
- device name do người dùng đặt;
- platform;
- app version;
- last seen;
- revoked flag.

Admin/user có thể revoke thiết bị; thiết bị revoked không được tiếp tục sync.

## SYNC-017 — UX trạng thái đồng bộ

Mọi màn hình có dữ liệu offline SHOULD dùng biểu tượng/trạng thái nhất quán:
- `Đã lưu trên thiết bị`;
- `Đang đồng bộ`;
- `Đã đồng bộ lúc HH:mm`;
- `Có xung đột cần xử lý`;
- `Lỗi đồng bộ`.

Không dùng chỉ màu; phải có icon/text.

## SYNC-018 — Conflict Center

Admin/GVCN theo scope có màn hình:
- tổng số conflict;
- domain;
- entity;
- trường bị conflict;
- base/local/server;
- người sửa;
- thiết bị;
- thời gian;
- đề xuất merge;
- quyết định;
- audit.

## SYNC-019 — Offline permission snapshot

Thiết bị được phép dùng offline dựa trên permission snapshot có TTL.

Nếu permission hết hạn/revoked trong khi thiết bị mất mạng:
- app có thể hạn chế write nhạy cảm sau TTL;
- khi reconnect phải revalidate;
- server có quyền reject operation tạo lúc permission không còn hợp lệ theo policy.

## SYNC-020 — Sync compatibility

Client/server handshake trao đổi:
- app version;
- API version;
- schema version;
- minimum supported client;
- feature flags.

Nếu không tương thích, app phải hướng dẫn update/migration, không cố sync mù.

# 39. API DESIGN STANDARD

## 39.1. Versioning
REST example:
`/api/v1/...`

Breaking change -> v2 hoặc compatible migration.

## 39.2. Resource examples
```text
GET /api/v1/students/{id}
GET /api/v1/classes/{id}/students
POST /api/v1/attendance-records
POST /api/v1/leave-requests
POST /api/v1/incidents
POST /api/v1/support-referrals
POST /api/v1/report-cards/{id}/submit
POST /api/v1/report-cards/{id}/sign
```

## 39.3. Response envelope
```json
{
  "data": {},
  "meta": {"request_id": "..."},
  "errors": []
}
```

## 39.4. Error codes
Không chỉ trả string. Ví dụ:
- `AUTH_FORBIDDEN`
- `RESOURCE_NOT_FOUND`
- `WORKFLOW_INVALID_STATE`
- `RECORD_LOCKED`
- `LEGAL_PERIOD_CLOSED`
- `DUPLICATE_STUDENT`
- `SYNC_CONFLICT`
- `SIGNATURE_REQUIRED`

## 39.5. Optimistic locking
Entity cần chống ghi đè dùng `version`/ETag.

## 39.6. Pagination
Cursor pagination cho dataset lớn.

## 39.7. Filter security
Không cho client filter sang scope ngoài quyền.

---

# 40. EVENT-DRIVEN ARCHITECTURE

Các domain event khuyến nghị:

```text
StudentCreated
StudentUpdated
StudentTransferred
StudentEnrollmentChanged
HomeroomTeacherAssigned
AttendanceRecorded
AttendanceCorrected
LeaveRequestSubmitted
LeaveRequestApproved
AssessmentLocked
AssessmentCorrected
StudentObservationCreated
SupportReferralCreated
IncidentReported
RewardApproved
HomeroomBookSubmitted
ReportCardValidated
ReportCardSigned
ReportCardPublished
DocumentArchived
PermissionGranted
PermissionRevoked
SensitiveRecordAccessed
```

## CORE-040
Event MUST có:
- event_id;
- event_type;
- aggregate_id;
- occurred_at;
- actor;
- correlation_id;
- schema_version.

## CORE-041
Consumer phải idempotent.

---

# 41. MÔ HÌNH DỮ LIỆU LOGIC

Đây là danh sách aggregate/table logical, không bắt buộc 1:1 với database table.

## 41.1. Identity & Organization
- `Person`
- `UserAccount`
- `Role`
- `Permission`
- `RolePermission`
- `UserRoleAssignment`
- `School`
- `Campus`
- `AcademicYear`
- `Term`
- `SchoolWeek`
- `EducationLevel`
- `GradeLevel`
- `ClassInstance`
- `Department`
- `Subject`
- `StaffProfile`
- `TeachingAssignment`
- `HomeroomAssignment`

## 41.2. Student
- `Student`
- `StudentIdentifier`
- `StudentEnrollment`
- `StudentClassMembership`
- `StudentStatusHistory`
- `Guardian`
- `StudentGuardianRelationship`
- `EmergencyContact`

## 41.3. Attendance
- `AttendanceSession`
- `AttendanceRecord`
- `LeaveRequest`
- `AttendanceCorrectionRequest`

## 41.4. Assessment
- `AssessmentRuleSet`
- `CourseOffering`
- `AssessmentItem`
- `AssessmentResult`
- `StudentEvaluation`
- `StudentComment`
- `TermEvaluation`
- `YearEvaluation`

## 41.5. Homeroom
- `HomeroomBook`
- `HomeroomPlan`
- `HomeroomWeeklyReview`
- `ClassMeeting`
- `ClassRoleAssignment`
- `StudentObservation`
- `StudentFollowUp`

## 41.6. Support
- `SupportSignal`
- `SupportReferral`
- `CounselingCase`
- `CounselingCaseNote`
- `SupportPlan`
- `Incident`
- `IncidentParty`
- `DisciplineProcess`
- `RewardNomination`
- `RewardDecision`

## 41.7. Activities
- `Activity`
- `ActivityParticipant`
- `ParentConsent`
- `CareerGuidanceRecord`

## 41.8. Health/Inclusion
- `StudentHealthProfile`
- `HealthAlert`
- `InclusiveEducationProfile`
- `Accommodation`

## 41.9. Communications
- `Conversation`
- `Message`
- `Announcement`
- `Notification`
- `Acknowledgement`
- `ParentContactLog`
- `Meeting`
- `MeetingParticipant`

## 41.10. Documents/Records
- `Document`
- `DocumentVersion`
- `DocumentSignature`
- `DocumentLink`
- `RetentionPolicy`
- `ArchiveRecord`
- `LegalHold`

## 41.11. Digital Report Card
- `DigitalReportCard`
- `DigitalReportCardVersion`
- `ReportCardSection`
- `ReportCardValidation`
- `ReportCardSignature`
- `ReportCardPublication`
- `ReportCardSyncStatus`

## 41.12. Operations
- `Task`
- `WorkflowDefinition`
- `WorkflowInstance`
- `WorkflowStep`
- `AuditEvent`
- `SecurityEvent`
- `IntegrationJob`
- `SyncConflict`
- `ImportJob`
- `ExportJob`

---


## 41.13. Seating

```text
ClassroomLayout
Seat
SeatAssignment
SeatConstraint
ClassGroup
ClassGroupMembership
LayoutVersion
```

## 41.14. Class Finance

```text
ClassLedger
FinancialCampaign
StudentFinancialObligation
FinancialTransaction
FinancialTransactionLine
FinancialCategory
FinancialApproval
FinancialReconciliation
```

`FinancialTransaction` SHOULD là append-only khi POSTED.

## 41.15. Behavior / Nề nếp

```text
BehaviorEventType
BehaviorEvent
BehaviorPointEntry
BehaviorPeriodSummary
```

Summary là derived/cache; ledger event là nguồn.

## 41.16. Offline Sync

```text
DeviceRegistration
SyncCursor
SyncOperation
SyncConflict
SyncConflictResolution
LocalAttachmentState   # logical model client-side
SyncSchemaVersion
```

# 42. QUY TẮC DATABASE

## DB-001
Primary key dùng UUID/ULID; không dùng số thứ tự lớp làm identity lâu dài.

## DB-002
Tất cả bảng nghiệp vụ quan trọng có:
- `created_at`;
- `created_by`;
- `updated_at`;
- `updated_by`;
- `version`.

## DB-003
Soft delete chỉ áp dụng record draft/không pháp lý; record chính thức dùng status/archive.

## DB-004
Timestamp lưu UTC; hiển thị `Asia/Ho_Chi_Minh` theo config.

## DB-005
PII nhạy cảm có thể mã hóa column-level nếu threat model yêu cầu.

## DB-006
Không log plaintext secret/token/password.

## DB-007
Foreign key và unique constraint phải dùng để bảo vệ data integrity; không dựa hoàn toàn vào application code.

## DB-008
Audit log SHOULD append-only và tách quyền sửa khỏi app thông thường.

---


## DB-009 — Version column

Entity đồng bộ có mutable state SHOULD có `row_version`/`entity_version` monotonic do server cấp.

## DB-010 — Field change metadata

Các entity cần merge field-level SHOULD có change metadata đủ để xác định field nào thay đổi từ base version, hoặc sync operation phải chứa patch field rõ ràng.

## DB-011 — Ledger integrity

Bảng finance/behavior ledger:
- không update amount/points của entry POSTED;
- reversal tham chiếu entry gốc;
- unique operation_id;
- audit trigger/application audit;
- check constraint phù hợp.

## DB-012 — Money

Tiền VND lưu bằng integer đơn vị đồng hoặc decimal cố định theo currency config; MUST NOT dùng float/double.

# 43. AUDIT TRAIL & TRUY VẾT

## AUD-001 — Audit event
```yaml
audit_id: uuid
actor_id: uuid|service
actor_role: string
action: string
resource_type: string
resource_id: string
scope: string
occurred_at: timestamp
ip: string|null
device_id: string|null
request_id: string
correlation_id: string
before_hash: string|null
after_hash: string|null
reason: string|null
result: SUCCESS|DENIED|FAILED
```

## AUD-002 — Hành động bắt buộc audit
- login/logout thất bại/thành công;
- đổi quyền;
- xem hồ sơ nhạy cảm;
- export;
- download file nhạy cảm;
- sửa dữ liệu;
- điều chỉnh sau khóa;
- ký số;
- phát hành;
- thu hồi;
- chia sẻ;
- break-glass;
- delete draft;
- thay đổi retention;
- restore archive.

## AUD-003
Audit log không cho end-user sửa/xóa.

## AUD-004
BGH/data protection/security role có dashboard access anomaly.

---

# 44. BẢO VỆ DỮ LIỆU CÁ NHÂN

## PRI-001 — Data inventory
MUST duy trì danh mục:
- field;
- mục đích;
- data owner;
- classification;
- retention;
- ai được truy cập;
- chia sẻ cho hệ thống nào.

## PRI-002 — Purpose limitation
Mỗi integration/export nhạy cảm SHOULD gắn purpose code.

## PRI-003 — Data minimization
API chỉ trả field cần thiết cho role/context.

Ví dụ GVBM không cần mặc định nhận đầy đủ thông tin gia đình.

## PRI-004 — Consent/Legal basis metadata
Nơi cần sự đồng ý phải ghi:
- subject/representative;
- purpose;
- version nội dung đồng ý;
- timestamp;
- channel;
- status;
- withdrawal nếu áp dụng.

## PRI-005 — Subject rights workflow
Hệ thống SHOULD có workflow xử lý yêu cầu liên quan dữ liệu cá nhân theo pháp luật/chính sách:
- tiếp nhận;
- xác minh;
- phân công;
- xử lý;
- phản hồi;
- audit.

## PRI-006 — Export/print control
Không cho bulk export dữ liệu toàn trường mặc định.

## PRI-007 — Masking
Có field masking:
- số định danh;
- điện thoại;
- địa chỉ;
- dữ liệu sức khỏe;
- ghi chú nhạy cảm.

## PRI-008 — Non-production
MUST NOT copy dữ liệu học sinh thật sang dev/test nếu không được de-identify/anonymize và có căn cứ quản trị phù hợp.

---

# 45. AN TOÀN THÔNG TIN

## SEC-001 — TLS
Mọi traffic production dùng TLS hiện hành.

## SEC-002 — Encryption at rest
DB, backup, object storage chứa PII SHOULD mã hóa at rest.

## SEC-003 — Secrets
Dùng secret manager; không commit key vào source.

## SEC-004 — MFA
Bắt buộc mặc định cho:
- super admin;
- school admin;
- BGH;
- signer;
- break-glass account.

## SEC-005 — Rate limit
Áp dụng login, OTP, search, export, API public.

## SEC-006 — OWASP
Ứng dụng MUST kiểm thử các nhóm rủi ro phổ biến: injection, broken access control, XSS, CSRF, SSRF, insecure upload, IDOR, session fixation, secrets leakage.

## SEC-007 — Access control tests
Mỗi API resource có negative permission tests.

## SEC-008 — File scan
Upload phải quét malware và kiểm tra MIME thực.

## SEC-009 — CSP/Security headers
Web SHOULD cấu hình CSP, HSTS, frame protections phù hợp.

## SEC-010 — Admin action
Thao tác cực nhạy cảm yêu cầu re-auth/MFA.

## SEC-011 — Security incident
Có playbook:
`DETECT -> CONTAIN -> INVESTIGATE -> RECOVER -> NOTIFY/REPORT AS REQUIRED -> POSTMORTEM`.

---

# 46. SAO LƯU, KHÔI PHỤC, DR

## OPS-001 — Backup
Tối thiểu:
- DB full backup;
- incremental/PITR nếu DB hỗ trợ;
- object/file backup;
- config backup;
- key/certificate recovery plan riêng.

## OPS-002 — Backup encryption
Backup MUST mã hóa và quyền tách biệt production app account.

## OPS-003 — Restore test
Không coi backup thành công nếu chưa test restore định kỳ.

## OPS-004 — RPO/RTO mục tiêu
Khuyến nghị ban đầu:
- RPO <= 15 phút cho DB chính nếu hạ tầng cho phép;
- RTO <= 4 giờ cho hệ thống lõi;
- có thể điều chỉnh theo quy mô/ngân sách.

## OPS-005 — DR drill
Thực hiện diễn tập ít nhất định kỳ theo chính sách trường/đơn vị vận hành.

---

# 47. YÊU CẦU PHI CHỨC NĂNG

## NFR-001 — Hiệu năng
- trang dashboard P95 <= 2.5s trong tải mục tiêu;
- API CRUD P95 <= 800ms không tính hệ thống ngoài;
- search P95 <= 2s;
- export lớn chạy async job.

## NFR-002 — Quy mô tham chiếu
Thiết kế tối thiểu cho một trường:
- 5.000 học sinh;
- 500 cán bộ;
- 300 lớp/năm;
- 10 năm dữ liệu online/hot-warm tùy policy;
- hàng triệu audit events.

Kiến trúc SHOULD scale lên cụm trường nếu cần mà không đổi domain model.

## NFR-003 — Availability
Mục tiêu >= 99.5% trong giờ vận hành; có thể nâng theo SLA.

## NFR-004 — Accessibility
Web SHOULD tuân theo nguyên tắc WCAG 2.1 AA ở mức phù hợp:
- keyboard navigation;
- contrast;
- label form;
- screen reader semantics;
- không chỉ dùng màu để truyền trạng thái.

## NFR-005 — Responsive / Mobile-first
Thiết kế **mobile-first**. Tối ưu Android cho điểm danh, nề nếp, gọi phụ huynh, nhập nhanh và duyệt; desktop cho bảng dữ liệu lớn, cấu hình, báo cáo, học bạ/ký số.

Breakpoint tham chiếu:
- 360px: mobile nhỏ;
- 480px: mobile lớn;
- 768px: tablet;
- 1024px: laptop;
- 1280px+: desktop.

Không hard-code UI chỉ chạy ở 1920x1080.

## NFR-006 — Localization / Date-Time
Tách string khỏi code; mặc định `vi-VN`.

Quy chuẩn hiển thị mặc định:
- ngày: `dd/MM/yyyy`;
- ngày giờ: `dd/MM/yyyy HH:mm`;
- giờ: `HH:mm` 24 giờ;
- timezone: `Asia/Ho_Chi_Minh` / UTC+07:00;
- tên thứ/tháng hiển thị tiếng Việt;
- số tiền: VND, không phần thập phân trừ khi cấu hình currency khác.

Backend lưu instant UTC; business date của trường được tính theo timezone config.

## NFR-007 — Observability
Có metrics/log/traces; PII phải được redaction.

## NFR-008 — Maintainability
Module domain rõ; không tạo “god service”.

## NFR-009 — Compatibility
Support browser hiện hành phổ biến; định nghĩa chính thức trong release policy.

---


## NFR-010 — Offline usability

Các màn hình được đánh dấu offline-capable MUST mở được trong <= 2 giây từ local cache ở thiết bị tham chiếu sau lần tải đầu, không chờ network timeout.

## NFR-011 — Installability

Web app SHOULD là installable PWA trên Chrome/Edge/Android. Android MAY đóng gói bằng wrapper native để dùng SQLite/secure storage/deep-link tốt hơn.

## NFR-012 — Touch & density

- touch target >= 44x44 px;
- form control đủ khoảng cách;
- bảng desktop có density compact/comfortable;
- mobile ưu tiên card/list và sticky action bar thay vì ép bảng ngang quá rộng.

# 48. UX/UI INFORMATION ARCHITECTURE

## 48.1. Menu giáo viên
1. Tổng quan
2. Lớp chủ nhiệm
3. Lớp giảng dạy
4. Học sinh
5. Chuyên cần
6. Đánh giá
7. Sổ chủ nhiệm
8. Hoạt động
9. Phụ huynh
10. Hỗ trợ học sinh
11. Nhiệm vụ & lịch
12. Hồ sơ
13. Báo cáo

Menu tự ẩn theo role nhưng backend vẫn bảo vệ.

## 48.2. Menu BGH
1. Điều hành
2. Toàn trường
3. Học sinh
4. Giáo viên/phân công
5. Chuyên cần
6. Chuyên môn/đánh giá
7. Chủ nhiệm
8. Học bạ số
9. Khen thưởng/kỷ luật
10. Tư vấn/hỗ trợ
11. Hoạt động
12. Hồ sơ/lưu trữ
13. Báo cáo
14. Workflow
15. Phân quyền
16. Cấu hình
17. Audit/an toàn
18. Tích hợp

## 48.3. Thiết kế thao tác
- Không quá 3 click cho tác vụ hàng ngày.
- Bulk action có preview.
- Hành động phá hủy/khó hoàn tác có confirmation rõ.
- Hành động bị cấm phải nêu lý do: “Dữ liệu đã khóa ngày…” thay vì chỉ disable nút.
- Hiển thị source và thời gian cập nhật của dữ liệu quan trọng.

---


# 48A. DESIGN SYSTEM, UI/UX TOOLCHAIN & FRONTEND QUALITY GATE

## UX-001 — Nguyên tắc thiết kế

Đây là phần mềm nghiệp vụ giáo dục dùng hàng ngày, vì vậy ưu tiên:
1. rõ ràng;
2. tốc độ thao tác;
3. khả năng quét thông tin;
4. ít lỗi nhập;
5. mobile touch tốt;
6. accessibility;
7. thẩm mỹ hiện đại nhưng không “trang trí quá mức”.

Không dùng visual trend làm giảm readability của bảng điểm/danh sách học sinh.

## UX-002 — Bộ skill thiết kế bắt buộc trong quy trình AI frontend

Khi AI agent hỗ trợ thiết kế/implement frontend, SHOULD cài và dùng ba skill upstream sau:

### A. Anthropic Frontend Design
- upstream: `https://github.com/anthropics/skills/tree/main/skills/frontend-design`;
- mục tiêu: định hướng giao diện có chủ đích, tránh UI generic;
- dùng ở bước chọn visual direction và triển khai màn hình/component mới.

### B. Vercel Web Design Guidelines
- upstream: `https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines`;
- mục tiêu: review UI theo accessibility/interaction/layout/web interface best practices;
- dùng như quality gate sau khi implement.

### C. UI/UX Pro Max
- upstream: `https://github.com/nextlevelbuilder/ui-ux-pro-max-skill`;
- mục tiêu: tra cứu design system, product pattern, typography, color, UX, stack guidance;
- dùng trước khi chốt design tokens/page pattern và khi audit UX.

### Quy tắc cài đặt / tải về trong môi trường phát triển

Không copy snapshot không rõ nguồn vào repository dự án. Khi máy phát triển có Internet, có thể tải upstream theo cách kiểm soát phiên bản sau:

```bash
mkdir -p tools/ai-skills-upstream

git clone --depth 1 https://github.com/anthropics/skills.git tools/ai-skills-upstream/anthropics-skills
git clone --depth 1 https://github.com/vercel-labs/agent-skills.git tools/ai-skills-upstream/vercel-agent-skills
git clone --depth 1 https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git tools/ai-skills-upstream/ui-ux-pro-max-skill
```

Sau khi review, ghi commit SHA:
```bash
git -C tools/ai-skills-upstream/anthropics-skills rev-parse HEAD
git -C tools/ai-skills-upstream/vercel-agent-skills rev-parse HEAD
git -C tools/ai-skills-upstream/ui-ux-pro-max-skill rev-parse HEAD
```

Với UI/UX Pro Max, upstream hiện cung cấp CLI cài theo AI assistant; ví dụ:
```bash
npx ui-ux-pro-max-cli init --ai claude
npx ui-ux-pro-max-cli init --ai codex
npx ui-ux-pro-max-cli init --ai universal
```

Đối với Anthropic/Vercel, đội phát triển SHOULD dùng cơ chế skill/plugin chính thức của agent đang chạy hoặc copy **đúng thư mục skill từ clone upstream đã pin commit** vào thư mục skills của agent. Không dựa vào mirror bên thứ ba khi có upstream chính thức.

Build/setup script SHOULD:
- cài từ upstream chính thức;
- pin commit/tag đã review;
- lưu `source_url`, `commit_sha`, `license`, `installed_at` trong `docs/ai-skills-lock.yml`;
- kiểm tra update định kỳ có chủ đích;
- không auto-update skill giữa một sprint mà không review vì output AI có thể thay đổi.

Ví dụ manifest:
```yaml
skills:
  - id: anthropic-frontend-design
    source: https://github.com/anthropics/skills/tree/main/skills/frontend-design
    commit: PINNED_SHA
  - id: vercel-web-design-guidelines
    source: https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines
    commit: PINNED_SHA
  - id: ui-ux-pro-max
    source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
    commit: PINNED_SHA
```

Skill là trợ lý thiết kế, không được override yêu cầu pháp lý, accessibility, security hoặc product requirements trong Master Plan.

## UX-003 — Thứ tự dùng skill

Workflow chuẩn cho một màn hình mới:
1. đọc Master Plan + role + use case;
2. dùng UI/UX Pro Max để đề xuất pattern/density/design system phù hợp sản phẩm giáo dục nghiệp vụ;
3. dùng Anthropic Frontend Design để tạo visual direction cụ thể, tránh generic dashboard;
4. implement theo component/design token của dự án;
5. test responsive 360/375/480/768/1024/1280+;
6. audit bằng Vercel Web Design Guidelines;
7. accessibility review;
8. visual regression;
9. UX acceptance theo persona giáo viên.

## UX-004 — Font mặc định

**Primary UI font đề xuất: `Be Vietnam Pro`** vì được thiết kế tập trung cho tiếng Việt, có hệ dấu tiếng Việt tốt, hiện đại và phù hợp UI.

Font stack:
```css
font-family: "Be Vietnam Pro", Inter, "Segoe UI", Roboto, Arial, sans-serif;
```

Nguyên tắc:
- ưu tiên self-host font được cấp phép hợp lệ trong production để ổn định/offline;
- không phụ thuộc Google Fonts runtime khi cần offline hoàn toàn;
- tải chỉ các weight thực sự dùng;
- preload font chính hợp lý;
- giữ system fallback để app vẫn đọc tốt khi font custom chưa sẵn sàng;
- không nhúng/chia sẻ font thương mại không rõ license.

Weight khuyến nghị:
- 400 body;
- 500 control/label;
- 600 section/title;
- 700 heading quan trọng.

## UX-005 — Typography scale

Mobile-first reference:
- body: 14–16px;
- table dense: 13–14px;
- label: 13–14px;
- title card: 16–18px;
- page title: 22–28px responsive;
- line-height body >= 1.45.

Không dùng chữ quá nhỏ để nhồi nhiều dữ liệu.

## UX-006 — Navigation responsive

Mobile:
- bottom navigation tối đa 4–5 destination chính;
- phần còn lại trong More/menu;
- floating/sticky primary action khi hữu ích;
- không dùng hover làm cách duy nhất truy cập chức năng.

Desktop:
- sidebar có collapse;
- quick search;
- breadcrumb cho cấu hình sâu;
- keyboard shortcut cho người dùng power-user.

## UX-007 — Data table responsive

Desktop:
- sortable/filterable;
- sticky header;
- column visibility;
- density option;
- virtualize khi dữ liệu lớn.

Mobile:
- chuyển thành card/list khi phù hợp;
- cột quan trọng nằm trước;
- chi tiết mở bottom sheet/full screen;
- không bắt người dùng scroll ngang bảng 10–15 cột để làm tác vụ chính.

## UX-008 — Offline UI state

Top-level shell SHOULD có sync indicator nhất quán.

Khi offline:
- banner nhẹ `Đang làm việc ngoại tuyến`;
- tác vụ offline-capable vẫn active;
- tác vụ online-only giải thích lý do;
- hiển thị số thay đổi đang chờ sync;
- không dùng modal chặn toàn app chỉ vì mất mạng.

## UX-009 — Empty/error/loading state

Mỗi màn hình MUST thiết kế đủ:
- first-use empty;
- filtered empty;
- loading;
- partial data;
- stale/offline data;
- permission denied;
- server error;
- sync conflict;
- success.

## UX-010 — Color & semantic tokens

Không hard-code màu status ở từng component.

Design tokens tối thiểu:
```text
color.bg
color.surface
color.text.primary
color.text.secondary
color.border
color.primary
color.success
color.warning
color.danger
color.info
color.focus
```

Light mode là baseline. Dark mode MAY triển khai sau nếu đủ contrast/QA.

## UX-011 — Icons

Dùng một icon set SVG nhất quán. Không dùng emoji làm icon chức năng chính.

Icon MUST có accessible name khi ý nghĩa không được thể hiện bằng text.

## UX-012 — Motion

Motion mức thấp đến trung bình:
- 120–220ms cho micro-interaction thông thường;
- tôn trọng `prefers-reduced-motion`;
- không animation dài khi giáo viên nhập dữ liệu liên tục.

## UX-013 — Form productivity

Form thường dùng SHOULD có:
- auto-focus hợp lý;
- Enter/Tab navigation;
- keyboard shortcut trên desktop;
- sticky save bar khi form dài;
- autosave draft cục bộ khi an toàn;
- validation inline;
- không xóa dữ liệu người dùng khi reload/offline.

## UX-014 — Accessibility target

Mục tiêu WCAG 2.2 AA ở các phần có thể áp dụng, tối thiểu không thấp hơn baseline NFR accessibility hiện hành của dự án.

## UX-015 — Design QA checklist

Trước merge frontend:
- [ ] 360px không tràn ngang không chủ đích;
- [ ] 375/768/1024/1280 screenshots đạt;
- [ ] keyboard navigation;
- [ ] focus visible;
- [ ] 200% zoom vẫn dùng được;
- [ ] touch target đạt;
- [ ] Vietnamese dấu không clipping;
- [ ] offline state rõ;
- [ ] error/empty/loading có thiết kế;
- [ ] permission denied không lộ data;
- [ ] Vercel guideline audit không còn lỗi nghiêm trọng;
- [ ] visual regression approved.

# 49. CẤU HÌNH TÙY CHỌN CHI TIẾT

Admin UI MUST chia config thành các nhóm:

## 49.1. General
- school info;
- timezone mặc định `Asia/Ho_Chi_Minh`;
- locale mặc định `vi-VN`;
- date format `dd/MM/yyyy`;
- time format `HH:mm`;
- 24-hour clock bắt buộc mặc định;
- branding;
- academic year;
- default UI font;
- theme;
- mobile navigation profile.

## 49.2. Academic
- cấp học;
- khối;
- môn;
- học kỳ;
- tuần;
- rule sets;
- mốc khóa.

## 49.3. Attendance
- điểm danh kiểu nào;
- late threshold;
- GVCN approval limit;
- alert threshold;
- edit lock.

## 49.4. Homeroom
- template sổ;
- review cadence;
- required sections;
- auto-generated sections.

## 49.5. Parent
- portal enabled;
- visible data;
- messaging hours;
- consent flows;
- acknowledgement.

## 49.6. Notification
- channels;
- digest;
- quiet hours;
- emergency override.

## 49.7. Documents
- template;
- signing provider;
- watermark;
- storage;
- retention policies.

## 49.8. AI
- enabled modules;
- provider;
- allowed data classes;
- max context;
- human approval;
- retention of prompts.

## 49.9. Security
- MFA;
- session timeout;
- password policy;
- allowed IP optional;
- export limits;
- break-glass.

## 49.10. Integration
- endpoint;
- credentials via secret reference;
- schedule;
- mapping;
- ownership;
- conflict policy.


## 49.11. Seating
- room layout template;
- row/column count;
- grouping mode;
- optimizer strategies enabled;
- balance academic band on/off;
- print template;
- signature labels.

## 49.12. Class Finance
- module enabled;
- allowed item types;
- currency;
- approval thresholds;
- required receipt threshold;
- parent transparency level;
- close period cadence;
- export watermark.

## 49.13. Behavior / Nề nếp
- event catalog;
- default points;
- point limits;
- visibility defaults;
- summary period;
- whether score is displayed to student/parent;
- auto rule enabled/disabled;
- correction policy.

## 49.14. Offline & Sync
- local-only/connected mode;
- server URL;
- tenant/school mapping;
- auto sync;
- interval;
- sync on reconnect;
- attachment Wi-Fi-only;
- local cache retention;
- permission snapshot TTL;
- conflict policy profile;
- minimum client version;
- manual sync allowed;
- device registration required.

## 49.15. Import/Export
- accepted file types;
- max file size;
- standard Excel templates;
- saved column aliases;
- default export format;
- DOCX/PDF template by module;
- CSV formula injection protection.

## 49.16. UI/UX
- font family;
- density default;
- sidebar/bottom nav profile;
- theme;
- reduced motion preference inheritance;
- large text mode optional;
- default landing dashboard per role.

## CFG-100
Mọi config phải có:
- key;
- value;
- scope;
- version;
- effective date;
- changed_by;
- changed_at;
- audit.

---

# 50. PHÂN QUYỀN CHI TIẾT — PERMISSION CATALOG ĐỀ XUẤT

Dưới đây là permission code tối thiểu để triển khai.

## 50.1 Student
- `student.list`
- `student.view.basic`
- `student.view.personal`
- `student.edit.basic`
- `student.edit.identifiers`
- `student.view.timeline`
- `student.export`
- `student.merge`

## 50.2 Guardian
- `guardian.list`
- `guardian.view`
- `guardian.create`
- `guardian.edit`
- `guardian.verify`
- `guardian.link_student`
- `guardian.manage_portal_access`

## 50.3 Attendance
- `attendance.view`
- `attendance.record`
- `attendance.edit_open_period`
- `attendance.request_correction`
- `attendance.approve_correction`
- `leave.submit`
- `leave.review`
- `leave.approve_within_limit`
- `leave.approve_extended`
- `attendance.export`

## 50.4 Assessment
- `assessment.view`
- `assessment.enter_own_subject`
- `assessment.edit_open_period`
- `assessment.lock`
- `assessment.request_correction`
- `assessment.approve_correction`
- `evaluation.homeroom_complete`
- `assessment.export`

## 50.5 Homeroom
- `homeroom.view`
- `homeroom.edit_own_class`
- `homeroom.submit`
- `homeroom.review`
- `homeroom.approve`
- `homeroom.export`

## 50.6 Report card
- `reportcard.view`
- `reportcard.prepare`
- `reportcard.validate_subject`
- `reportcard.validate_homeroom`
- `reportcard.review_school`
- `reportcard.sign`
- `reportcard.publish`
- `reportcard.revoke`
- `reportcard.request_correction`
- `reportcard.export`
- `reportcard.sync`
- `reportcard.view_audit`

## 50.7 Communication
- `message.send_student`
- `message.send_parent`
- `message.send_class`
- `announcement.create`
- `announcement.publish`
- `contactlog.create`
- `contactlog.view`

## 50.8 Reward/Discipline
- `reward.nominate`
- `reward.review`
- `reward.approve`
- `incident.report`
- `incident.view_assigned`
- `incident.assign`
- `incident.investigate`
- `discipline.propose`
- `discipline.review`
- `discipline.decide`
- `incident.close`
- `incident.export`

## 50.9 Counseling
- `counseling.referral.create`
- `counseling.referral.view_status`
- `counseling.case.view`
- `counseling.case.assign`
- `counseling.case.edit`
- `counseling.note.view`
- `counseling.note.create`
- `counseling.share_summary`
- `counseling.case.close`

## 50.10 Health
- `health.alert.view`
- `health.profile.view`
- `health.profile.edit`
- `health.export`

## 50.11 Documents
- `document.view`
- `document.upload`
- `document.edit_metadata`
- `document.approve`
- `document.sign`
- `document.download`
- `document.export`
- `document.archive`
- `document.restore`

## 50.12 Admin
- `config.view`
- `config.edit`
- `role.view`
- `role.create`
- `role.edit`
- `permission.assign`
- `user.manage`
- `assignment.manage`
- `workflow.manage`
- `integration.manage`
- `audit.view`
- `security.view`
- `breakglass.approve`


## 50.13 Seating
- `seating.view`;
- `seating.edit`;
- `seating.randomize`;
- `seating.optimize`;
- `seating.manage_constraints`;
- `seating.export`;
- `class_group.manage`.

## 50.14 Class Finance
- `finance.view_class_summary`;
- `finance.view_student_status`;
- `finance.create_campaign`;
- `finance.record_income`;
- `finance.record_expense`;
- `finance.reverse_transaction`;
- `finance.approve_transaction`;
- `finance.close_period`;
- `finance.export`;
- `finance.configure`.

## 50.15 Behavior
- `behavior.view`;
- `behavior.record`;
- `behavior.correct`;
- `behavior.configure_event_catalog`;
- `behavior.publish_to_parent`;
- `behavior.export`.

## 50.16 Sync
- `sync.view_own_status`;
- `sync.run_manual`;
- `sync.resolve_own_scope_conflict`;
- `sync.view_school_conflicts`;
- `sync.resolve_school_conflicts`;
- `sync.configure_server`;
- `sync.register_device`;
- `sync.revoke_device`.

## PERM-100
Permission assignment UI MUST cho xem “quyền hiệu lực thực tế” sau khi cộng role + scope + deny rule.

## PERM-101 — Explicit deny
Engine SHOULD hỗ trợ deny ưu tiên cao hơn allow cho dữ liệu nhạy cảm.

---

# 51. DEFAULT ROLE POLICY

## 51.1. HOMEROOM_TEACHER
Default scope `OWN_HOMEROOM_CLASS`:
- student basic/personal theo nhu cầu;
- attendance full lớp;
- assessment view;
- homeroom edit;
- guardian/contact;
- referral create;
- incident report/process trong phạm vi được giao;
- report card homeroom validation;
- không mặc định xem counseling notes;
- không mặc định xem full health profile;
- không ký thay BGH.

## 51.2. SUBJECT_TEACHER
Scope `OWN_SUBJECT_CLASSES`:
- danh sách lớp;
- attendance nếu trường bật theo tiết;
- assessment own subject;
- student observation;
- limited student info;
- không xem dữ liệu gia đình chi tiết trừ khi được phân quyền.

## 51.3. PRINCIPAL
Scope `SCHOOL`, nhưng sensitive data vẫn theo need-to-know và workflow; không nên dùng một “god mode” thông thường.

## 51.4. VICE_PRINCIPAL
Scope theo assignment: cấp/khối/tổ/lớp.

## 51.5. COUNSELOR
Chỉ case được phân công + quyền triage; không xem điểm toàn trường nếu không cần.

## 51.6. PARENT
Scope `OWN_CHILD`; chỉ published/parent-visible data.

## 51.7. STUDENT
Scope `SELF`; chỉ student-visible data.

---

# 52. WORKFLOW MẪU BẮT BUỘC

## 52.1. Đơn nghỉ
```text
Parent/Student submit
 -> Homeroom checks duration/reason
 -> if <= configured homeroom limit: approve/reject
 -> else escalate to authorized role
 -> update attendance
 -> notify parent
 -> archive request
```

## 52.2. Điều chỉnh điểm
```text
Teacher requests correction
 -> provide old/new/reason
 -> reviewer validates
 -> authorized approver approves
 -> assessment version updated
 -> audit written
 -> if report card affected: mark report card reconciliation required
```

## 52.3. Học bạ số
```text
Generate draft
 -> validate data
 -> subject teachers confirm assigned sections
 -> GVCN complete/confirm
 -> school review
 -> signing workflow
 -> publish
 -> sync external
 -> archive immutable version
```

## 52.4. Sự việc
```text
Report
 -> triage
 -> assign
 -> collect facts
 -> meet student
 -> coordinate parent/support
 -> educational measures
 -> if formal discipline required: review/decision
 -> follow-up
 -> close
```

## 52.5. Hỗ trợ học sinh
```text
Signal/referral
 -> GVCN review
 -> resolve locally OR refer counselor
 -> counselor triage
 -> support plan
 -> review milestones
 -> close or continue
```

## 52.6. Cuối năm học
```text
Freeze roster
 -> reconcile attendance
 -> complete assessments
 -> resolve corrections
 -> final evaluations
 -> promotion status
 -> reward proposals
 -> report card completion/signing
 -> homeroom book close
 -> archive package
 -> handover next year
```

---


## 52.7. Giao dịch quỹ cần điều chỉnh

```text
POSTED
 -> REVERSAL_REQUESTED
 -> APPROVED
 -> REVERSAL_POSTED
 -> CORRECT_TRANSACTION_POSTED
```

Không sửa amount của giao dịch POSTED.

## 52.8. Xử lý sync conflict

```text
DETECTED
 -> ASSIGNED
 -> REVIEWING
 -> RESOLVED_LOCAL|RESOLVED_SERVER|MERGED
 -> APPLIED
 -> CLOSED
```

Resolution phải audit.

# 53. KIỂM SOÁT ĐÓNG/MỞ KỲ DỮ LIỆU

## CORE-060
Hệ thống có `DataPeriodLock` cho:
- attendance;
- assessment;
- homeroom monthly;
- term;
- year-end.

## CORE-061
Lock có:
- scope;
- locked_at;
- locked_by;
- reason;
- exceptions.

## CORE-062
Sau lock, mọi correction đi workflow riêng.

---

# 54. CHUYỂN NĂM HỌC

## OPS-020 — Year rollover wizard
Các bước:
1. kiểm tra năm cũ;
2. xác nhận hồ sơ chưa hoàn thành;
3. tạo năm mới;
4. tạo khối/lớp;
5. mapping lớp cũ -> lớp mới;
6. promote/retain/transfer students;
7. phân công GVCN;
8. phân công GVBM;
9. clone config phù hợp;
10. không clone dữ liệu nghiệp vụ cá nhân không cần thiết;
11. tạo handover summary;
12. mở năm mới.

## OPS-021
Không cập nhật `class_id` cũ của học sinh để “chuyển lớp”; phải tạo membership/enrollment mới.

## OPS-022
Hồ sơ support đang active được carry-forward có kiểm soát và quyền.

---

# 55. CHUYỂN TRƯỜNG

## STU-050
Workflow:
- request transfer;
- verify identity;
- close local enrollment;
- prepare transferable package;
- revoke obsolete portal permissions;
- handover records theo policy;
- sync report card/lifelong record khi hệ thống ngoài hỗ trợ;
- archive local references.

## STU-051
Không xóa lịch sử vì học sinh đã chuyển trường.

---

# 56. BÀN GIAO GVCN

## HMR-050
Khi đổi GVCN:
- khóa assignment cũ theo ngày;
- tạo assignment mới;
- bàn giao danh sách task mở;
- tổng quan lớp;
- parent follow-up mở;
- support coordination mà GVCN mới cần biết;
- kế hoạch đang thực hiện;
- không tự bàn giao counseling note bí mật.

## HMR-051
Có biên bản/handover record và người nhận xác nhận.

---

# 57. HỆ THỐNG QUY TẮC CẢNH BÁO

## 57.1. Rule schema
```yaml
rule_id: ATT-RISK-001
name: "Vắng nhiều trong thời gian ngắn"
source_domain: attendance
condition:
  absent_count_gte: 3
  window_days: 14
action:
  create_signal: true
severity: INFO|NOTICE|PRIORITY
scope: homeroom
explanation_template: "Học sinh vắng {{count}} buổi trong {{window}} ngày"
enabled: true
```

## 57.2. Governance
- rule phải có owner;
- version;
- lý do;
- không tự gán diagnosis;
- có thể test bằng dữ liệu giả trước bật.

---

# 58. BÁO CÁO PHÁP LÝ / HỒ SƠ CẦN SINH

Hệ thống SHOULD hỗ trợ template hóa các sản phẩm đầu ra sau, tùy cấp học và quy định địa phương:

1. Sổ chủ nhiệm.
2. Danh sách học sinh lớp.
3. Danh sách ban cán sự/tổ.
4. Kế hoạch chủ nhiệm.
5. Biên bản sinh hoạt lớp.
6. Báo cáo tình hình lớp.
7. Tổng hợp chuyên cần.
8. Danh sách học sinh nghỉ/vắng.
9. Báo cáo phối hợp PHHS.
10. Biên bản họp PHHS.
11. Biên bản làm việc cá nhân.
12. Danh sách đề nghị khen thưởng.
13. Hồ sơ/biên bản xử lý sự việc theo workflow.
14. Danh sách lên lớp/không lên lớp/rèn luyện hè khi áp dụng.
15. Bảng tổng hợp đánh giá theo cấp học.
16. Học bạ/bản thể hiện học bạ số.
17. Phiếu/báo cáo hoạt động trải nghiệm.
18. Danh sách chuyển đi/chuyển đến.
19. Handover GVCN.
20. Báo cáo hồ sơ đến hạn lưu trữ/disposition.

- Sơ đồ chỗ ngồi/chia tổ A4 DOCX/PDF theo template trường;
- Báo cáo nề nếp và quỹ lớp là hồ sơ nghiệp vụ nội bộ/tùy chọn, không tự nhận là hồ sơ pháp lý bắt buộc.

## RPT-050
Mỗi template phải có `template_id`, `version`, `effective_from`, `education_level`, `legal_basis`.

---

# 59. THƯ VIỆN BIỂU MẪU

Admin quản lý:
- mẫu chuẩn toàn trường;
- mẫu theo cấp;
- mẫu theo năm học;
- trạng thái draft/approved/retired.

Không cho giáo viên sửa mẫu chuẩn nếu không có quyền; giáo viên chỉ điền dữ liệu/section được phép.

---

# 60. QUẢN LÝ CHỮ KÝ SỐ VÀ XÁC NHẬN

## HBS-050 — Signer profile
- user;
- role;
- certificate/provider reference;
- valid_from/to;
- signing purposes allowed.

## HBS-051
Trước ký phải xác thực:
- signer account active;
- đúng role;
- cert hợp lệ;
- document hash;
- document state.

## HBS-052
Sau ký lưu:
- signature payload/reference;
- certificate info;
- timestamp;
- hash;
- validation result.

## HBS-053
Không lưu private key trong app database.

---

# 61. TÍCH HỢP CSDL GIÁO DỤC / HỒ SƠ HỌC TẬP SUỐT ĐỜI

## INT-050 — Identifier mapping
Không đoán mã ngoài. Lưu mapping:
```text
local_student_id
external_system
external_student_id
lifelong_learning_record_id
verified_at
verification_source
```

## INT-051 — Sync direction
Mỗi field có ownership:
- authoritative local;
- authoritative external;
- bidirectional with review.

## INT-052
Không cho người dùng chỉnh trường authoritative external nếu policy không cho phép; tạo correction request gửi source system.

## INT-053
Kết nối học bạ số phải sẵn sàng chuẩn định dạng mở và mã định danh thống nhất theo TT70/2026; format cụ thể phải cập nhật theo tài liệu kỹ thuật Bộ khi được ban hành/cung cấp.

---

# 62. MIGRATION TỪ EXCEL / PHẦN MỀM CŨ

## MIG-001 — Inventory

Inventory nguồn cũ SHOULD bao gồm thêm:
- file danh sách lớp Excel;
- file điểm TX/GK/CK;
- file chuyên cần/nề nếp;
- file thu/chi quỹ lớp;
- sơ đồ lớp cũ nếu có thể map;
- danh bạ phụ huynh.

Liệt kê:
- nguồn dữ liệu;
- owner;
- format;
- quality;
- năm học;
- sensitivity;
- retention.

## MIG-002 — Mapping spec
Mỗi cột nguồn map rõ sang field đích.

## MIG-003 — Staging
Không import thẳng production domain table. Dùng staging.

## MIG-004 — Reconciliation
Sau migrate:
- count;
- key fields;
- checksum/sample;
- duplicate report;
- missing values;
- sign-off owner.

## MIG-005
Không cố migrate mọi ghi chú cũ nếu không còn giá trị/lưu trữ hợp pháp; cần data minimization review.

---

# 63. KIỂM THỬ

## TST-001 — Unit test
Rule engine, permission engine, workflow, calculations.

## TST-002 — Integration test
- DB;
- signing adapter;
- SSO;
- notification;
- external sync.

## TST-003 — Permission test
Tối thiểu mỗi endpoint:
- allow expected;
- deny wrong role;
- deny wrong scope;
- deny expired assignment;
- deny sensitive class;
- deny after lock.

## TST-004 — Workflow test
Test mọi transition hợp lệ và transition bị cấm.

## TST-005 — Legal regression
Khi update rule pháp lý, giữ test fixtures năm cũ để bảo đảm không làm thay đổi dữ liệu lịch sử.

## TST-006 — Security
- SAST;
- dependency scan;
- DAST;
- penetration test trước go-live;
- access-control focused testing.

## TST-007 — Performance
Load test theo peak:
- điểm danh đầu buổi;
- nhập điểm cuối kỳ;
- phát hành học bạ;
- bulk notification.

## TST-008 — Backup restore
Test restore là tiêu chí nghiệm thu bắt buộc.

## TST-009 — UAT Personas
Kịch bản UAT riêng cho:
- GVCN;
- GVBM;
- BGH;
- tổ trưởng;
- tư vấn;
- y tế;
- văn thư;
- phụ huynh;
- học sinh.

---


## TST-010 — Offline/sync matrix

Bắt buộc test:
- PC offline 7 ngày rồi sync;
- Android offline 7 ngày rồi sync;
- PC và Android sửa hai field khác nhau cùng entity;
- PC và Android sửa cùng field khác giá trị;
- attendance cùng slot conflict;
- behavior append từ 2 thiết bị;
- finance transaction retry 5 lần không duplicate;
- attachment upload gián đoạn/resume;
- revoke device khi offline rồi reconnect;
- client cũ schema không tương thích;
- clock device lệch +/- 2 giờ;
- đổi timezone OS nhưng app vẫn hiển thị school timezone đúng.

## TST-011 — Seating
- random giữ đủ HS, không trùng/mất;
- locked seat không bị di chuyển;
- constraint front-row được tôn trọng;
- random seed tái hiện được;
- chia tổ đủ số lượng;
- export DOCX A4 không vỡ layout với tên dài.

## TST-012 — Finance
- số dư đúng sau thu/chi;
- reversal trả số dư đúng;
- partial payment đúng;
- concurrent offline transactions không duplicate;
- user không có quyền không xem được nợ HS khác;
- export đối soát đúng tổng.

## TST-013 — Behavior
- point summary = ledger;
- reversal/correction đúng;
- visibility không leak sang parent;
- score không tự thay official conduct assessment.

## TST-014 — Responsive/UX
- 360, 375, 480, 768, 1024, 1280+;
- Android portrait/landscape cơ bản;
- keyboard-only desktop;
- 200% zoom;
- Vietnamese long names;
- offline banner/sync conflict state;
- touch target >= 44px.

# 64. ACCEPTANCE CRITERIA CẤP HỆ THỐNG

Sản phẩm chỉ đạt “MVP production-ready” khi:

1. phân quyền backend đầy đủ;
2. Student Master không trùng nguồn;
3. GVCN dùng được dashboard/lớp/chuyên cần/sổ chủ nhiệm/phụ huynh;
4. GVBM cập nhật dữ liệu trong phạm vi môn;
5. workflow sửa dữ liệu sau khóa hoạt động;
6. audit log hoạt động;
7. file upload an toàn;
8. backup + restore test thành công;
9. parent portal không lộ dữ liệu học sinh khác;
10. retention policy tồn tại;
11. report card model structured;
12. signing/integration có adapter architecture;
13. dữ liệu nhạy cảm tách quyền;
14. year rollover không phá lịch sử;
15. UAT ký xác nhận bởi đại diện nghiệp vụ.

---


- Local-only mode chạy được không cần server cho các module cốt lõi được chọn.
- Khi server được cấu hình, dữ liệu local có wizard merge/reconciliation, không whole-row overwrite.
- PC và Android có thể sửa hai field khác nhau cùng hồ sơ và sau sync giữ được cả hai thay đổi khi rule cho phép.
- Sơ đồ lớp có random/chia tổ/constraint/version/export DOCX A4.
- Quỹ lớp có ma trận thu, ledger thu/chi, partial payment, reversal và báo cáo đối soát.
- Nề nếp có append-only event ledger và không tự quyết định rèn luyện chính thức.
- Excel roster import có mapping/preview/error report.
- UI đáp ứng mobile-first, tiếng Việt, định dạng 24h GMT+7.

# 65. LỘ TRÌNH TRIỂN KHAI KHUYẾN NGHỊ

## Giai đoạn 0 — Discovery & Legal Baseline
- khảo sát quy trình trường;
- danh mục hệ thống hiện có;
- data inventory;
- legal review;
- chốt role/scope;
- chốt source-of-truth.

**Deliverables:** Process Map, Data Map, Permission Matrix, Legal Baseline.

## Giai đoạn 1 — Foundation + Local-first
- local database abstraction + outbox/inbox;
- PWA installability;
- device identity;
- Local Only mode;
- sync contract stub để không phải đổi domain model về sau;
- IAM;
- school config;
- academic year;
- org;
- staff;
- student master;
- guardian;
- permissions;
- audit.

## Giai đoạn 2 — Daily Homeroom
- sơ đồ chỗ ngồi + chia tổ 1 chạm;
- nhật ký nề nếp;
- quỹ lớp/ma trận thu-chi nếu feature bật;
- fast Excel roster import;
- class cockpit;
- attendance;
- leave;
- parent contact;
- task/calendar;
- basic notifications.

## Giai đoạn 3 — Academic Collaboration
- assessment integration/entry;
- GVBM observations;
- term workflow;
- reports.

## Giai đoạn 4 — Homeroom Record
- homeroom book;
- class meeting;
- planning;
- monthly/year-end reporting;
- archive.

## Giai đoạn 5 — Student Support
- incident;
- reward;
- counseling referral/case;
- inclusion;
- health alerts;
- early review signals.

## Giai đoạn 6 — Digital Report Card
- structured report card;
- validation;
- signing;
- publication;
- external sync adapter;
- verification.

## Giai đoạn 7 — Advanced
- report builder;
- AI assistant;
- data warehouse;
- advanced integration;
- mobile app nếu cần.

---

# 66. CHIẾN LƯỢC KIẾN TRÚC PHẦN MỀM

## 66.1. Khuyến nghị ban đầu: Modular Monolith
Đối với một trường hoặc một cụm trường vừa, SHOULD khởi đầu bằng modular monolith thay vì microservices quá sớm.

Module boundary:
```text
Identity
Organization
Student
Attendance
Assessment
Homeroom
Communication
Support
Activity
Documents
ReportCard
Reporting
Integration
Audit
Configuration
```

## 66.2. Khi nào tách service
Chỉ tách khi có:
- scale độc lập;
- security boundary rõ;
- release cadence khác;
- integration tải lớn;
- organizational ownership khác.

Candidates:
- Notification Service;
- File/Document Service;
- Integration Gateway;
- AI Service;
- Reporting/Warehouse.

---

# 67. TECH STACK THAM CHIẾU, KHÔNG BẮT BUỘC

Có thể chọn theo năng lực đội ngũ, nhưng yêu cầu offline-first khiến frontend/local storage phải được quyết định sớm.

## 67.1. Stack tham chiếu ưu tiên cho một codebase PC + Android

### Frontend
- TypeScript;
- React hoặc Vue — chọn một và dùng xuyên suốt;
- PWA/service worker;
- responsive CSS/design token;
- component library có accessibility tốt hoặc component nội bộ theo design system.

### PC
Baseline: installable PWA chạy trên Chrome/Edge.

Optional: Tauri/Electron chỉ khi cần tích hợp native sâu như auto-start, filesystem/printing đặc thù. Không bắt đầu bằng desktop shell nếu PWA đáp ứng đủ.

### Android
Ưu tiên PWA; nếu cần native secure storage/SQLite/deep link/file integration tốt hơn, dùng wrapper như Capacitor hoặc lựa chọn tương đương đã được đội ngũ review.

### Local storage
Thông qua repository abstraction:
- browser/PWA: IndexedDB adapter;
- native wrapper: SQLite adapter;
- domain code không phụ thuộc adapter cụ thể.

### Server giai đoạn kết nối
Chọn một backend chính: ASP.NET Core / Java Spring Boot / NestJS theo đội ngũ.

- DB server: PostgreSQL;
- cache: Redis khi cần;
- object storage: S3-compatible;
- queue: RabbitMQ/Kafka tùy quy mô;
- search: PostgreSQL FTS trước, OpenSearch khi cần;
- observability: OpenTelemetry;
- container: Docker; Kubernetes chỉ khi có năng lực vận hành.

## 67.2. Lý do không dùng server-centric UI làm điều kiện bắt buộc

Các framework SSR/server component MAY dùng, nhưng **critical offline path không được phụ thuộc round-trip server để render/commit**. Nếu chọn framework server-centric, phải tách rõ offline-capable client domain.

## 67.3. Shared domain contracts

Schema/contract SHOULD sinh type cho client/server từ một nguồn hoặc có contract test để tránh mismatch sync protocol.

## TECH-001
Không chọn công nghệ chỉ vì “AI viết code nhanh”; ưu tiên vận hành và đội ngũ trường/đơn vị triển khai.

---

# 68. CI/CD & MÔI TRƯỜNG

Môi trường:
- local;
- dev;
- test;
- staging;
- production.

## OPS-050
Production config/secret tách biệt.

## OPS-051
Migration DB phải versioned và có rollback/forward plan.

## OPS-052
Release học kỳ/cuối năm cần change freeze window hợp lý.

## OPS-053
Feature flag dùng để rollout dần module rủi ro.

---

# 69. OBSERVABILITY

## OPS-060 — Metrics
- request rate/error/latency;
- queue depth;
- sync failures;
- login failures;
- export jobs;
- report card signing queue;
- notification delivery;
- DB health.

## OPS-061 — Business metrics
- % lớp điểm danh đúng hạn;
- % sổ chủ nhiệm hoàn thành;
- % assessment complete;
- % report card ready;
- task overdue;
- sync reconciliation.

## OPS-062
Business dashboard không hiển thị ranking giáo viên mang tính trừng phạt nếu không có chính sách quản trị phù hợp.

---

# 70. QUẢN LÝ THAY ĐỔI PHÁP LÝ

## LEG-100 — Legal Registry
Tạo bảng/module:
```text
LegalDocument
- code
- title
- issued_date
- effective_from
- effective_to
- status
- source_url
- impacted_modules
- review_owner
```

## LEG-101 — Change process
```text
New regulation detected
 -> legal review
 -> impact analysis
 -> rule/template/schema changes
 -> migration plan
 -> test
 -> approval
 -> effective-date deployment
```

## LEG-102
Không back-apply rule mới vào năm học cũ nếu văn bản không yêu cầu.

## LEG-103
Ngày 08/10/2026, TT70/2026 có hiệu lực: release plan phải bảo đảm các chức năng học bạ số chính thức dùng rule đã được xác nhận theo hiệu lực thực tế.

---

# 71. QUẢN TRỊ HỆ THỐNG TOÀN TRƯỜNG

Ban giám hiệu/Admin có Control Center:

1. Tình trạng người dùng.
2. Phân công.
3. Phân quyền.
4. Năm học.
5. Workflow.
6. Feature flag.
7. Mẫu hồ sơ.
8. Dữ liệu thiếu.
9. Đồng bộ.
10. Học bạ số.
11. Hồ sơ lưu trữ.
12. Security events.
13. Audit.
14. Backup status.
15. Integration health.
16. Legal registry.

---

# 72. MÀN HÌNH CHI TIẾT CẦN XÂY

## 72.1. Authentication
- Login
- MFA
- Forgot password
- Active sessions

## 72.2. Teacher
- My Dashboard
- My Homeroom
- My Teaching Classes
- Student Detail
- Attendance
- Leave Requests
- Assessment
- Student Observation
- Parent Contacts
- Class Meetings
- Homeroom Plan
- Homeroom Book
- Activities
- Student Support Queue
- Tasks
- Calendar
- Reports

## 72.3. Management
- School Dashboard
- Academic Structure
- Staff Assignments
- Student Registry
- Permission Center
- Workflow Center
- Report Card Center
- Reward/Discipline Center
- Support Center
- Document/Archive Center
- Report Center
- Audit Center
- Integrations
- Settings

## 72.4. Parent
- Home
- Children Switcher
- Attendance
- Learning Results
- Notices
- Leave Request
- Activities/Consent
- Meetings
- Documents/Report Card
- Profile/Contacts

## 72.5. Student
- Home
- Attendance
- Results
- Activities
- Notices
- Personal tasks
- Support request (nếu trường bật)

---


## 72.6. Daily Homeroom Extensions
- Sơ đồ lớp;
- Wizard chia tổ;
- Nhật ký nề nếp hôm nay;
- Cấu hình loại nề nếp;
- Quỹ lớp dashboard;
- Ma trận thu;
- Nhập khoản chi;
- Sổ giao dịch;
- Đối soát quỹ;
- Import Excel roster;
- Import gradebook;
- Trung tâm đồng bộ;
- Trung tâm xung đột.

## 72.7. Settings / Device
- Kết nối server;
- Kiểm tra kết nối;
- Trạng thái đồng bộ;
- Thiết bị hiện tại;
- Dữ liệu offline đã cache;
- Xóa cache an toàn;
- Backup local;
- Restore local.

# 73. CHI TIẾT “STUDENT 360” HIỂN THỊ THEO ROLE

## GVCN view
- basic profile;
- guardians;
- attendance;
- learning summary;
- activity;
- parent contacts;
- support signals;
- case status summary;
- essential health alert;
- timeline.

## GVBM view
- basic profile;
- contact channel thông qua hệ thống chứ không nhất thiết số PHHS;
- subject results;
- attendance relevant;
- accommodation cần cho dạy học;
- observations.

## Counselor view
- referral context;
- approved educational context;
- case notes;
- support plan;
- limited academic data cần thiết.

## Parent view
- only published data.

---

# 74. DATA CLASSIFICATION THEO FIELD — MẪU

| Field | Class | Default access |
|---|---|---|
| Họ tên HS | PERSONAL | GV liên quan/BGH/PHHS/HS |
| Mã HS | EDUCATION_STANDARD | GV liên quan |
| Số định danh cá nhân | SENSITIVE | rất hạn chế |
| Điểm | PERSONAL/EDUCATION | GV liên quan + PHHS/HS khi công bố |
| Chuyên cần | PERSONAL/EDUCATION | GV liên quan + PHHS/HS |
| SĐT PHHS | PERSONAL | GVCN/văn phòng theo nhiệm vụ |
| Địa chỉ | PERSONAL | giới hạn |
| Tình trạng sức khỏe | SENSITIVE | y tế + need-to-know |
| Counseling note | SENSITIVE/SEALED | counselor/case team |
| Incident evidence | SENSITIVE/SEALED | case team |
| Học bạ đã phát hành | OFFICIAL PERSONAL RECORD | theo thẩm quyền |

---

# 75. QUY TẮC “KHÔNG NHẬP TRÙNG”

1. GVCN không nhập lại điểm đã có từ GVBM.
2. Không nhập lại sĩ số vào sổ chủ nhiệm; tính từ enrollment.
3. Không nhập lại danh sách PHHS vào biên bản họp; chọn từ guardian.
4. Không nhập lại vắng vào báo cáo; lấy attendance.
5. Không nhập lại thành tích vào học bạ nếu đã có source record hợp lệ.
6. Không nhập lại phân công giáo viên ở nhiều module.
7. Không nhập lại tên trường/năm học trên từng hồ sơ.

---

# 76. CƠ CHẾ SNAPSHOT

Một số tài liệu cần “ảnh chụp dữ liệu tại thời điểm phát hành”.

## DOC-050
Khi generate official document:
- lấy dữ liệu source;
- tạo snapshot JSON normalized;
- hash snapshot;
- render document;
- lưu template version;
- ký/phát hành.

Sau này source thay đổi, bản đã phát hành vẫn tái tạo được đúng nội dung cũ.

---

# 77. CHÍNH SÁCH XÓA DỮ LIỆU

## PRI-050
Không có nút “Delete Student” production đối với hồ sơ học sinh đã phát sinh nghiệp vụ.

## PRI-051
Draft sai có thể delete nếu:
- chưa liên kết official record;
- có quyền;
- audit.

## PRI-052
Disposition sau retention phải là workflow có phê duyệt và log, không cron job xóa tự động.

---

# 78. BUSINESS CONTINUITY KHI MẤT MẠNG

## OPS-080 — Offline là năng lực nền tảng

Ứng dụng MUST hỗ trợ offline cho tối thiểu các use case được bật:
- xem roster lớp đã cache;
- điểm danh;
- ghi nề nếp;
- quick note/follow-up;
- xem/sửa sơ đồ lớp;
- ghi giao dịch quỹ theo quyền;
- xem thông tin liên hệ phụ huynh đã được phép cache;
- xem task/lịch đã tải;
- nhập dữ liệu gradebook draft cho owner nếu policy cho phép.

## OPS-081 — Giới hạn dữ liệu cache

Không cho offline mode tải toàn bộ hồ sơ nhạy cảm.

Cache policy theo data class:
- PUBLIC/INTERNAL: có thể cache lâu hơn;
- PERSONAL: cache theo lớp/scope và TTL;
- SENSITIVE/SEALED: mặc định không cache hoặc cache mã hóa cực hạn chế;
- attachment nhạy cảm: explicit download/offline pin mới cache.

## OPS-082 — Offline backup

Local Only mode MUST có backup/export encrypted package tùy nền tảng trước khi server được triển khai.

Backup có:
- schema version;
- school/local tenant id;
- device id;
- created_at;
- checksum;
- encryption metadata;
- restore validation.

---

# 79. MOBILE APP / PWA

## 79.1. Mobile-first baseline

Android là nền tảng sử dụng hạng nhất, không phải bản thu nhỏ của desktop.

Use case ưu tiên:
- điểm danh;
- nề nếp;
- sơ đồ lớp;
- gọi phụ huynh;
- ghi nhật ký trao đổi;
- thông báo;
- duyệt đơn;
- xem lịch/task;
- quick observation;
- activity attendance;
- quỹ lớp nhập nhanh;
- scan/chụp minh chứng khi được phép.

## 79.2. PC

Desktop ưu tiên:
- import/export Excel;
- gradebook lớn;
- report builder;
- permission config;
- template DOCX/PDF;
- reconciliation conflict;
- financial reconciliation;
- học bạ/ký số.

## 79.3. Cross-device continuity

Người dùng có thể bắt đầu việc trên Android và hoàn thiện trên PC sau sync.

Draft có `draft_id`/entity UUID chung để không tạo bản sao mới chỉ vì đổi thiết bị.

---

# 80. QUẢN LÝ THIẾT BỊ VÀ PHIÊN

## SEC-050
Cho user xem/revoke device session.

## SEC-051
Admin thấy metadata thiết bị, không cần thu thập fingerprint quá mức.

## SEC-052
Thiết bị dùng chung ở trường SHOULD hỗ trợ auto logout nhanh và không lưu PII cache lâu.

---

# 81. THÔNG BÁO KHẨN CẤP

## COM-050
Emergency broadcast chỉ role được cấp quyền.

## COM-051
Có scope:
- school;
- grade;
- class;
- staff;
- guardians.

## COM-052
MUST audit sender, content, audience, delivery stats.

---

# 82. SEARCH & REPORT PRIVACY ATTACK PREVENTION

## SEC-070
Ngăn enumeration student ID qua API.

## SEC-071
Aggregate report có thể áp dụng suppression khi nhóm quá nhỏ nếu báo cáo có nguy cơ lộ dữ liệu nhạy cảm.

## SEC-072
Autocomplete không trả PII ngoài scope.

---

# 83. QUẢN LÝ TỆP MINH CHỨNG

## DOC-070
Tệp phải có category:
- attendance excuse;
- reward evidence;
- incident evidence;
- activity evidence;
- support document;
- report attachment;
- identity document (hạn chế mạnh).

## DOC-071
Không lưu ảnh giấy tờ định danh nếu không thật sự cần/có căn cứ.

## DOC-072
Image metadata có thể chứa GPS; SHOULD strip EXIF khi không cần.

---

# 84. ANALYTICS

## RPT-080 — Nguyên tắc

Analytics MAY dùng dữ liệu chuyên cần/nề nếp/quỹ ở mức phù hợp, nhưng:
- không tạo bảng xếp hạng “học sinh vi phạm nhiều nhất” công khai;
- tài chính lớp chỉ tổng hợp theo quyền;
- sync analytics phục vụ vận hành, không đánh giá giáo viên chỉ từ số lần dùng app.

Analytics ưu tiên hỗ trợ quản lý, không tạo hồ sơ profiling không cần thiết.

Có thể có:
- attendance trends;
- completion trends;
- parent acknowledgement;
- activity participation;
- workload/status.

## RPT-081
Không dùng analytics để “xếp hạng học sinh có nguy cơ” bằng thuật toán mờ đục.

---

# 85. DATA WAREHOUSE (GIAI ĐOẠN NÂNG CAO)

Tách reporting warehouse khỏi OLTP khi cần.

ETL chỉ đưa field cần thiết; pseudonymize khi báo cáo không cần danh tính.

---

# 86. HỖ TRỢ VÀ HELPDESK

## OPS-100
Có support ticket nội bộ:
- loại lỗi;
- module;
- screenshot được kiểm soát;
- severity;
- user;
- trạng thái.

## OPS-101
Support staff không dùng cách xin password người dùng.

## OPS-102
Impersonation nếu có phải:
- được cấp quyền;
- banner rõ “đang hỗ trợ dưới danh nghĩa…”;
- audit;
- hạn chế thao tác ký/phê duyệt.

---

# 87. NHẬT KÝ THAY ĐỔI CẤU HÌNH

Mọi thay đổi:
- role;
- workflow;
- grading rule;
- feature flag;
- template;
- retention;
- integration;
- AI policy;

phải có `before`, `after`, `actor`, `reason`, `effective_at`.

---

# 88. KỊCH BẢN NGHIỆP VỤ END-TO-END MẪU

## Scenario A — HS nghỉ 2 ngày
1. PHHS gửi đơn.
2. Hệ thống xác định GVCN.
3. GVCN xem lý do/minh chứng.
4. Rule xác nhận <= 3 ngày.
5. GVCN duyệt.
6. Attendance cập nhật.
7. PHHS nhận kết quả.
8. Audit lưu.

## Scenario B — Điểm sai sau khóa
1. GVBM phát hiện.
2. Tạo correction request.
3. Chọn record cũ, nhập mới, lý do.
4. Người có thẩm quyền duyệt.
5. Version mới tạo.
6. Nếu học bạ draft đã sinh, hệ thống đánh dấu revalidate.
7. Audit.

## Scenario C — GVCN nhận tín hiệu vắng nhiều
1. Rule tạo signal.
2. Dashboard GVCN hiển thị dữ kiện.
3. GVCN xem attendance timeline.
4. Liên hệ PHHS.
5. Ghi ContactLog.
6. Nếu cần tạo support referral.
7. Signal đóng/được theo dõi.

## Scenario D — Học bạ cuối năm
1. Dữ liệu môn hoàn tất.
2. GVCN hoàn tất phần chủ nhiệm.
3. Validator chạy.
4. Các lỗi được sửa qua workflow.
5. Review.
6. Ký số.
7. Publish.
8. Sync.
9. Immutable archive.

## Scenario E — Chuyển GVCN giữa năm
1. Admin đóng assignment cũ ngày X.
2. Tạo assignment mới ngày X+1.
3. Permission recalculated.
4. Handover task.
5. Teacher mới nhận dữ liệu cần biết.
6. Counseling sealed note không tự chia sẻ.

---

# 89. CÁC ANTI-PATTERN PHẢI TRÁNH

1. Một bảng `students` chứa tất cả từ điểm đến sức khỏe.
2. Role admin có quyền tuyệt đối vào mọi nội dung.
3. Chỉ phân quyền bằng menu frontend.
4. Lưu học bạ PDF không có data model.
5. Update record đã ký.
6. Ghi đè điểm không log.
7. Xóa user làm mất tên tác giả lịch sử.
8. Dùng Excel làm source-of-truth song song vô thời hạn.
9. AI tự gửi nội dung cho phụ huynh.
10. Lưu token/API key trong database plaintext/source code.
11. Một workflow cứng cho mọi trường.
12. Một rule đánh giá cho mọi cấp/năm.
13. Trộn counseling notes vào timeline công khai.
14. Export không audit.
15. Import không preview/reconciliation.

---


- Whole-row last-write-wins cho hồ sơ học sinh khi sync.
- Mất mạng thì khóa toàn bộ ứng dụng dù dữ liệu đã có local.
- Tự tăng/giảm mức rèn luyện chính thức từ điểm nề nếp.
- Cho sửa số dư quỹ trực tiếp.
- Xóa giao dịch quỹ đã post để “sửa cho nhanh”.
- Random chỗ ngồi mà bỏ qua seat constraint đã khóa.
- Hiển thị nhãn học lực nhạy cảm ngay trên sơ đồ lớp.
- Ép bảng desktop nhiều cột xuống mobile bằng scroll ngang vô hạn.
- Dùng font không đủ dấu tiếng Việt hoặc phụ thuộc CDN font khi app phải offline.
- Ẩn lỗi sync/conflict và báo “Đã lưu” không rõ lưu local hay server.

# 90. DEFINITION OF DONE CHO MỖI FEATURE

Một feature chỉ Done khi:
- requirements có ID;
- UX approved;
- permission defined;
- data classification defined;
- migration impact reviewed;
- audit events defined;
- tests pass;
- accessibility basic checked;
- telemetry added;
- docs updated;
- security review nếu nhạy cảm;
- legal rule mapping nếu liên quan.

---


Nếu feature offline-capable, DoD bổ sung:
- local persistence test;
- sync operation defined;
- merge/conflict policy documented;
- offline/error/stale UI state;
- Android + PC test.

Nếu feature có UI mới, DoD bổ sung:
- mobile-first screenshots;
- Vercel guideline audit;
- accessibility review;
- Vietnamese typography QA;
- visual regression.

# 91. TÀI LIỆU CON CẦN TẠO SAU MASTER PLAN

Bắt buộc bổ sung:
- `SYNC_PROTOCOL.md`;
- `CONFLICT_POLICY_MATRIX.md`;
- `OFFLINE_DATA_CLASSIFICATION.md`;
- `DESIGN_SYSTEM.md`;
- `UI_RESPONSIVE_SPEC.md`;
- `AI_SKILLS_LOCK.yml`;
- `SEATING_ALGORITHM_SPEC.md`;
- `CLASS_FINANCE_LEDGER_SPEC.md`;
- `BEHAVIOR_LEDGER_SPEC.md`;
- `EXCEL_IMPORT_MAPPING_SPEC.md`.


Từ file này, đội dự án nên sinh tiếp:

1. `01_Product_Requirements_Document.md`
2. `02_System_Architecture.md`
3. `03_Database_ERD.md`
4. `04_API_Spec_OpenAPI.yaml`
5. `05_Permission_Matrix.xlsx/md`
6. `06_Workflow_Definitions.md`
7. `07_Data_Dictionary.md`
8. `08_Security_Threat_Model.md`
9. `09_Privacy_Data_Inventory.md`
10. `10_Test_Plan.md`
11. `11_Deployment_Runbook.md`
12. `12_Backup_DR_Runbook.md`
13. `13_Legal_Rules_Catalog.md`
14. `14_Report_Template_Catalog.md`
15. `15_Integration_Mapping.md`
16. `16_UAT_Scenarios.md`

---

# 92. ƯU TIÊN TRIỂN KHAI THEO MOSCOW

## MUST
- Offline-first local data layer cho tác vụ cốt lõi;
- Sync protocol có idempotency + conflict handling;
- Mobile-first responsive;
- Fast Excel roster import;
- IAM/RBAC+ABAC;
- school/year/class/student/guardian;
- staff assignment;
- attendance/leave;
- homeroom;
- assessment rule separation;
- parent communication;
- reports cơ bản;
- document/retention;
- audit;
- security/backup;
- report card structured model;
- integration architecture.

## SHOULD
- Sơ đồ lớp + chia tổ 1 chạm;
- Quỹ lớp/ma trận thu-chi;
- Nhật ký nề nếp;
- DOCX A4 template;
- counseling;
- incident/reward workflow;
- activities;
- task/calendar;
- parent/student portal;
- signing adapter;
- advanced reports.

## MAY
- AI;
- offline attendance;
- advanced data warehouse;
- mobile native app;
- external messaging channels.

> Một số mục SHOULD sẽ trở thành MUST tùy loại trường/quy trình thực tế.

---

# 93. RỦI RO DỰ ÁN VÀ BIỆN PHÁP

| Rủi ro | Tác động | Biện pháp |
|---|---|---|
| Cố tái tạo toàn bộ phần mềm trường | Scope quá lớn | Xác định integration boundary |
| Quyền quá đơn giản | Lộ dữ liệu | RBAC+ABAC, test negative |
| Pháp luật thay đổi | Sai rule | Legal registry + effective dating |
| Dữ liệu cũ bẩn | Sai hồ sơ | staging + reconciliation |
| Giáo viên phải nhập nhiều | Không dùng | enter once/use many |
| Microservice quá sớm | Vận hành khó | modular monolith |
| AI lộ PII | Rủi ro cao | policy guard/data minimization |
| Ký số phụ thuộc vendor | Lock-in | provider adapter |
| Mất mạng | Không điểm danh | PWA/offline optional |
| Backup không khôi phục được | Mất dữ liệu | restore drills |
| Học bạ PDF-only | Không đồng bộ | structured model |
| Excel song song kéo dài | Hai nguồn chuẩn | migration cutover plan |

---


| Rủi ro | Hậu quả | Giảm thiểu |
|---|---|---|
| Offline sync ghi đè dữ liệu | Mất thông tin | field-level patch, base_version, conflict center |
| Hai thiết bị tạo duplicate giao dịch | Sai quỹ | UUID + idempotency + reconciliation |
| Điểm nề nếp bị dùng như kỷ luật tự động | Sai nghiệp vụ | explicit separation + human review |
| Local device mất/hỏng trước khi có server | Mất dữ liệu | encrypted backup/restore + nhắc backup |
| Cache nhạy cảm quá nhiều | Rò rỉ dữ liệu | data-class cache policy + encryption + TTL |
| UI đẹp nhưng khó nhập nhanh | Giảm sử dụng | teacher persona UAT + density/keyboard workflow |

# 94. KẾ HOẠCH PILOT

## Pilot scope khuyến nghị
- 1 khối hoặc 3–5 lớp;
- 5–10 GVCN;
- GVBM liên quan;
- 1 phó hiệu trưởng;
- 1 văn thư;
- nhóm PHHS thử nghiệm.

## Pilot metrics
- tỷ lệ thao tác hoàn thành offline;
- số conflict / 1.000 operation;
- conflict auto-merged vs manual;
- duplicate finance transaction rate;
- thời gian import roster Excel;
- thời gian điểm danh mobile;
- crash/reload khi network thay đổi;
- thời gian điểm danh;
- số lỗi nhập;
- số thao tác trùng;
- tỷ lệ thông báo đọc;
- số support tickets;
- permission incidents;
- thời gian hoàn tất báo cáo.

## Go/no-go
Chỉ mở toàn trường sau khi:
- không có lỗi quyền mức critical;
- backup restore pass;
- workflow chính pass;
- training hoàn tất;
- data migration sign-off.

---

# 95. KẾ HOẠCH ĐÀO TẠO NGƯỜI DÙNG

## GVCN
- sơ đồ lớp/chia tổ;
- nề nếp;
- quỹ lớp;
- offline/sync/conflict;
- import Excel;
- dashboard;
- attendance;
- phụ huynh;
- student follow-up;
- homeroom book;
- cuối kỳ.

## GVBM
- lớp;
- assessment;
- observation;
- correction workflow.

## BGH
- review;
- report;
- workflow;
- report card;
- audit.

## Văn thư
- document;
- archive;
- retention;
- handover.

## Counselor/health
- privacy;
- case scope;
- sharing summary.

## Admin CNTT
- cấu hình server sync;
- device registration/revoke;
- conflict center;
- schema/client compatibility;
- local backup recovery support;
- user;
- permissions;
- integration;
- backup;
- security.

---

# 96. QUY TRÌNH HỖ TRỢ SAU GO-LIVE

Severity:
- `SEV1`: hệ thống không dùng được/lộ dữ liệu/nghi ngờ xâm nhập.
- `SEV2`: chức năng lõi lỗi diện rộng.
- `SEV3`: lỗi có workaround.
- `SEV4`: yêu cầu cải tiến.

Mỗi incident có owner, timeline, root cause, corrective action.

---

# 97. ROADMAP 24 THÁNG MẪU

## 0–3 tháng
- dựng PWA mobile-first + local store/outbox;
- roster/import Excel;
- sơ đồ lớp;
Foundation + Student + Permission + Attendance.

## 4–6 tháng
- nề nếp + quỹ lớp;
- sync server MVP + device registration;
- conflict center;
Homeroom + Parent + Task + Reporting.

## 7–9 tháng
Assessment + year-end workflows.

## 10–12 tháng
Documents + retention + report card foundation + signing integration.

## 13–15 tháng
Support/counseling/incident/reward.

## 16–18 tháng
Activities + advanced parent/student portal.

## 19–21 tháng
Advanced integrations + data warehouse.

## 22–24 tháng
AI assistant + optimization + broader interoperability.

> Timeline phải điều chỉnh theo đội ngũ; thứ tự kiến trúc quan trọng hơn thời gian tuyệt đối.

---

# 98. CHECKLIST TRƯỚC KHI BẮT ĐẦU CODE

- [ ] Chốt phạm vi cấp học.
- [ ] Chốt source-of-truth từng domain.
- [ ] Chốt legal baseline.
- [ ] Chốt role templates.
- [ ] Chốt scope model.
- [ ] Chốt data classification.
- [ ] Chốt academic year model.
- [ ] Chốt student identifiers.
- [ ] Chốt integration systems.
- [ ] Chốt signing strategy.
- [ ] Chốt retention catalog.
- [ ] Chốt parent portal policy.
- [ ] Chốt counseling privacy policy.
- [ ] Chốt AI policy.
- [ ] Chốt backup/RPO/RTO.
- [ ] Chốt deployment ownership.

---


- [ ] Chốt Local Only + Connected School architecture.
- [ ] Chốt local repository abstraction và adapter PWA/Android.
- [ ] Chốt sync operation envelope + conflict matrix.
- [ ] Chốt font Be Vietnam Pro + license/source strategy.
- [ ] Pin 3 frontend/UI skills trong `AI_SKILLS_LOCK.yml`.
- [ ] Chốt seat map data model và export DOCX.
- [ ] Chốt class finance ledger và policy phạm vi.
- [ ] Chốt behavior ledger không gắn trực tiếp official conduct.
- [ ] Chuẩn hóa Excel roster template và alias tiếng Việt.

# 99. CHECKLIST TRƯỚC GO-LIVE

- [ ] Legal review cập nhật đến ngày go-live.
- [ ] Permission matrix UAT.
- [ ] Penetration/security test.
- [ ] Backup restore successful.
- [ ] Data migration reconciliation signed.
- [ ] Audit logging verified.
- [ ] Report card rules verified.
- [ ] Retention policies loaded.
- [ ] Parent data visibility tested.
- [ ] Sensitive case access tested.
- [ ] Admin break-glass tested.
- [ ] External sync reconciliation tested.
- [ ] Training complete.
- [ ] Helpdesk ready.
- [ ] Incident response contacts ready.
- [ ] Rollback plan ready.

---


- [ ] Test airplane mode trong giờ điểm danh.
- [ ] Test reconnect + sync từ Android.
- [ ] Test same-field conflict PC/Android.
- [ ] Kiểm tra không duplicate quỹ sau retry.
- [ ] Kiểm tra backup/restore local.
- [ ] Kiểm tra font tiếng Việt khi offline.
- [ ] Kiểm tra DOCX sơ đồ lớp A4.

# 100. APPENDIX A — RETENTION POLICY SEED DATA

```yaml
retention_policies:
  - id: RET-PRIMARY-REGISTER
    name: "Sổ đăng bộ - Tiểu học"
    legal_basis: "TT08/2025/TT-BGDĐT"
    duration: PERMANENT
  - id: RET-PRIMARY-CLASS-EVAL
    name: "Bảng tổng hợp kết quả đánh giá giáo dục của lớp - Tiểu học"
    legal_basis: "TT08/2025/TT-BGDĐT"
    duration: 10Y
  - id: RET-PRIMARY-REWARD-DISCIPLINE
    name: "Hồ sơ khen thưởng, kỷ luật học sinh - Tiểu học"
    duration: 10Y
  - id: RET-PRIMARY-REPORTCARD
    name: "Học bạ học sinh - Tiểu học"
    disposition: RETURN_TO_STUDENT_ON_EXIT_OR_TRANSFER
  - id: RET-PRIMARY-INCLUSIVE
    name: "Hồ sơ giáo dục học sinh khuyết tật - Tiểu học"
    disposition: HANDOVER_ON_TRANSFER_OR_LEVEL_CHANGE
  - id: RET-PRIMARY-HOMEROOM
    name: "Sổ chủ nhiệm - Tiểu học"
    duration: UNTIL_COURSE_END
  - id: RET-SECONDARY-REGISTER
    name: "Sổ đăng bộ - THCS/THPT"
    duration: PERMANENT
  - id: RET-SECONDARY-TRANSFER
    name: "Sổ theo dõi học sinh chuyển đi/chuyển đến"
    duration: 5Y
  - id: RET-SECONDARY-GRADEBOOK
    name: "Sổ gọi tên và ghi điểm"
    duration: PERMANENT
  - id: RET-SECONDARY-REWARD-DISCIPLINE
    name: "Hồ sơ khen thưởng, kỷ luật học sinh - THCS/THPT"
    duration: 10Y
  - id: RET-SECONDARY-INCLUSIVE
    name: "Hồ sơ giáo dục học sinh khuyết tật - THCS/THPT"
    duration: 10Y
  - id: RET-SECONDARY-HEADBOOK
    name: "Sổ ghi đầu bài"
    duration: UNTIL_COURSE_END
  - id: RET-SECONDARY-HOMEROOM
    name: "Sổ chủ nhiệm - THCS/THPT"
    duration: UNTIL_COURSE_END
```

---

# 101. APPENDIX B — ENUMS KHỞI TẠO

```yaml
student_status:
  - ACTIVE
  - TRANSFERRED
  - TEMPORARILY_INACTIVE
  - WITHDRAWN
  - COMPLETED
  - GRADUATED

workflow_status:
  - DRAFT
  - SUBMITTED
  - IN_REVIEW
  - APPROVED
  - REJECTED
  - SIGNED
  - PUBLISHED
  - REVOKED
  - ARCHIVED

record_visibility:
  - INTERNAL
  - HOMEROOM_ONLY
  - STAFF_NEED_TO_KNOW
  - PARENT_VISIBLE
  - STUDENT_VISIBLE
  - PUBLIC_WITHIN_SCHOOL
  - SEALED

priority:
  - LOW
  - NORMAL
  - HIGH
  - URGENT
```

---



### SyncStatus
```text
LOCAL_ONLY
PENDING_SYNC
SYNCING
SYNCED
CONFLICT
ERROR
```

### FinancialStatus
```text
DRAFT
POSTED
REVERSED
```

### StudentObligationStatus
```text
NOT_DUE
UNPAID
PARTIAL
PAID
EXEMPT
NOT_APPLICABLE
PENDING_RECONCILIATION
REFUNDED
```

### SeatingStrategy
```text
MANUAL
RANDOM_SHUFFLE
GROUP_BY_COLUMN
BALANCE_GROUP_SIZE
BALANCE_ACADEMIC_BAND
CUSTOM_CONSTRAINT_OPTIMIZER
```

### BehaviorVisibility
```text
TEACHER_INTERNAL
HOMEROOM_TEAM
STUDENT_VISIBLE
PARENT_VISIBLE
```

# 102. APPENDIX C — CẤU TRÚC CONFIG MẪU

```yaml
school:
  timezone: Asia/Ho_Chi_Minh
  locale: vi-VN
academic:
  levels: [LOWER_SECONDARY]
attendance:
  mode: SESSION
  homeroom_leave_approval_max_consecutive_days: 3
  correction_lock_after_days: 7
parent_portal:
  enabled: true
  show_attendance: true
  show_published_assessment: true
  allow_leave_request: true
ai:
  enabled: false
  allowed_data_classes: [EDUCATION_STANDARD]
security:
  mfa_roles: [SCHOOL_ADMIN, PRINCIPAL, VICE_PRINCIPAL]
  session_idle_minutes: 30
report_card:
  digital_enabled: true
  signing_provider: null
```

---



Ví dụ cấu hình mở rộng:
```yaml
locale:
  language: vi-VN
  timezone: Asia/Ho_Chi_Minh
  date_format: dd/MM/yyyy
  time_format: HH:mm
  hour_cycle: 24

ui:
  font_family: "Be Vietnam Pro"
  mobile_first: true
  density: comfortable

seating:
  enabled: true
  allow_random_shuffle: true
  allow_balance_academic_band: true
  export_template: seating-a4-v1

class_finance:
  enabled: true
  currency: VND
  immutable_posted_transactions: true
  parent_visibility: OWN_CHILD_AND_PUBLISHED_SUMMARY

behavior:
  enabled: true
  score_is_official_conduct: false
  default_visibility: TEACHER_INTERNAL

sync:
  mode: LOCAL_ONLY   # đổi CONNECTED sau khi server sẵn sàng
  server_base_url: null
  auto_sync: true
  on_network_regained: true
  conflict_policy_profile: SCHOOL_DEFAULT_V1
  permission_snapshot_ttl_hours: 24
```

# 103. APPENDIX D — API PERMISSION CHECK PSEUDOCODE

```text
function authorize(user, action, resource):
    roles = getActiveRoleAssignments(user, now)
    permissions = expandRoles(roles)
    context = buildContext(user, resource)

    if explicitDeny(permissions, action, resource, context):
        return DENY

    if not hasAllow(permissions, action, resource.type):
        return DENY

    if not scopeMatches(permissions, resource, context):
        return DENY

    if not classificationAllowed(user, resource.classification, context):
        return DENY

    if resource.isLocked and action is normalEdit:
        return DENY_WITH_CORRECTION_WORKFLOW

    return ALLOW
```

---

# 104. APPENDIX E — AUDIT EVENT MẪU

```json
{
  "audit_id": "01J...",
  "actor_id": "usr_...",
  "action": "attendance.correct.approve",
  "resource_type": "AttendanceRecord",
  "resource_id": "att_...",
  "occurred_at": "2026-08-26T13:20:00Z",
  "request_id": "req_...",
  "before_hash": "sha256:...",
  "after_hash": "sha256:...",
  "reason": "Điều chỉnh do nhập nhầm trạng thái",
  "result": "SUCCESS"
}
```

---

# 105. APPENDIX F — AI SYSTEM POLICY TÓM TẮT

```yaml
ai_policy:
  principle: HUMAN_IN_THE_LOOP
  prohibited_autonomous_actions:
    - modify_grade
    - issue_discipline_decision
    - diagnose_mental_health
    - publish_report_card
    - sign_document
    - send_sensitive_parent_message
    - delete_official_record
  data_access:
    inherit_user_permissions: true
    minimize_context: true
    sealed_case_default: deny
    health_default: deny
  output:
    draft_only: true
    require_human_review_for_official_record: true
```

---

# 106. APPENDIX G — NGUỒN PHÁP LÝ ĐÃ XÁC MINH TẠI BASELINE 26/08/2026

- TT 15/2026/TT-BGDĐT: https://vanban.chinhphu.vn/?classid=1&docid=217678&pageid=27160&typegroupid=6
- TT 30/2026/TT-BGDĐT: https://vanban.chinhphu.vn/?classid=1&docid=217839&orggroupid=4&pageid=27160
- NĐ 88/2026/NĐ-CP: https://vanban.chinhphu.vn/?docid=217356&pageid=27160
- TT 70/2026/TT-BGDĐT: https://chinhphu.vn/?docid=219275&pageid=27160&typegroupid=6
- TT 08/2025/TT-BGDĐT: https://vbpl.vn/TW/Pages/vbpq-toanvan.aspx?ItemID=177565
- TT 19/2025/TT-BGDĐT: https://vbpl.vn/TW/Pages/vbpq-toanvan.aspx?ItemID=183381&Keyword=
- TT 18/2025/TT-BGDĐT: https://vbpl.vn/bogiaoducdaotao/Pages/vbpq-toanvan.aspx?ItemID=183285
- TT 05/2025/TT-BGDĐT: https://chinhphu.vn/?docid=213113&pageid=27160
- TT 27/2020/TT-BGDĐT: https://vbpl.vn/TW/Pages/vbpq-print.aspx?ItemID=144123
- TT 22/2021/TT-BGDĐT: https://vbpl.vn/bogiaoducdaotao/Pages/ivbpq-thuoctinh.aspx?ItemID=150073
- Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15: https://vanban.chinhphu.vn/?classid=1&docid=214590&pageid=27160&typegroup=
- Luật Dữ liệu 60/2024/QH15: https://vanban.chinhphu.vn/?classid=1&docid=212488&pageid=27160
- Luật Giao dịch điện tử 20/2023/QH15: https://vanban.chinhphu.vn/?docid=208421&pageid=27160
- NĐ 23/2025/NĐ-CP: https://vanban.chinhphu.vn/?classid=1&docid=212829&pageid=27160

---


- TT55/2011/TT-BGDĐT — Điều lệ Ban đại diện cha mẹ học sinh — CSDL VBPL ghi nhận còn hiệu lực tại baseline 26/08/2026; module tài chính lớp phải áp dụng legal guard.
- Dự thảo Điều lệ Ban đại diện cha mẹ học sinh 08/2026 — chỉ là nguồn theo dõi thay đổi, **không phải rule production** cho tới khi văn bản chính thức được ban hành/có hiệu lực.

# 107. APPENDIX H — HƯỚNG DẪN CHO AI TIẾP QUẢN DỰ ÁN

Nếu một AI khác được giao phát triển dự án này, AI đó phải làm theo thứ tự:

1. Đọc toàn bộ file này.
2. Không viết code trước khi xác định module đang triển khai.
3. Với mỗi module, trích các requirement ID liên quan.
4. Xác định role/action/scope trước API.
5. Xác định source-of-truth trước schema.
6. Xác định data classification trước UI/API response.
7. Xác định workflow/state machine trước CRUD endpoint.
8. Xác định audit events trước release.
9. Xác định test cases, đặc biệt negative permission tests.
10. Khi có mâu thuẫn với văn bản pháp lý mới hơn, cập nhật Legal Registry và ghi rõ phần bị thay thế.
11. Không silently reinterpret requirement; tạo `Decision Record` khi cần thay đổi.
12. Mọi schema/rule phải version được nếu liên quan dữ liệu chính thức.

Mẫu Architecture Decision Record:
```yaml
adr_id: ADR-001
title: "..."
status: PROPOSED|ACCEPTED|SUPERSEDED
context: "..."
decision: "..."
consequences: "..."
requirements_impacted: ["..."]
approved_by: "..."
date: "YYYY-MM-DD"
```

---

# 108. APPENDIX I — MODULE DEPENDENCY MAP CHO AI/CODE AGENT

```text
Identity & Permission
        |
        v
Organization & Academic Year ------> Configuration / Legal Rules
        |                                      |
        v                                      v
Student Master <------ Guardian          Rule/Workflow Engine
        |\n        | +--> Seating / Class Group
        | +--> Class Finance Ledger
        | +--> Behavior Ledger
        |                    \                /
        |                     \              /
        +----> Attendance ------> Homeroom <---+
        |            |              |
        +----> Assessment ----------+------> Report Card
        |            |              |              |
        +----> Activities           |              +--> Signing / External Sync
        |                           |
        +----> Support / Incident / Counseling
        |                           |
        +----> Health / Inclusion   |
        |                           |
        +----------------------> Reports / Documents / Archive
                                    |
                                    v
                              Audit / Observability
```

## 108.1. Thứ tự phụ thuộc bắt buộc khi code

1. `Identity + Permission + Organization + AcademicYear` trước mọi domain có scope.
2. `Student + Enrollment + ClassMembership + Guardian` trước Attendance/Homeroom/Parent Portal.
3. `Workflow + Audit` phải có trước correction/signing/discipline.
4. `Assessment Rule Engine` trước year-end và report card.
5. `Document + Snapshot + Signature abstraction` trước phát hành hồ sơ chính thức.
6. `RetentionPolicy` trước archive/disposition.
7. `Integration Gateway` trước đồng bộ CSDL ngành/học bạ số; domain service không gọi vendor trực tiếp.
8. `Local Repository + Sync Operation Contract` phải có trước khi các module offline-capable hoàn thiện CRUD để tránh phải retrofit đồng bộ.
9. `Finance Ledger` và `Behavior Ledger` phải định nghĩa immutable/correction semantics trước UI bulk edit.
10. `Design System + responsive shell` phải có trước khi nhân rộng hàng chục màn hình.

## 108.2. Contract khi AI sinh code

Mỗi PR/commit lớn do AI tạo SHOULD ghi metadata trong mô tả:
```yaml
implementation_contract:
  module: "Attendance"
  requirements: ["ATT-001", "ATT-002", "ATT-003"]
  permissions: ["attendance.view", "attendance.record"]
  data_classification: "PERSONAL/EDUCATION"
  audit_events: ["AttendanceRecorded"]
  migrations: []
  tests:
    positive: []
    negative_permissions: []
    workflow: []
```

---


# 108A. APPENDIX J — SYNC CONFLICT POLICY SEED

```yaml
policies:
  student.profile:
    merge: FIELD_LEVEL
    same_field: MANUAL_REVIEW
  attendance.record:
    merge: COMPOSITE_KEY
    same_slot: CORRECTION_WORKFLOW
  behavior.event:
    merge: APPEND_UNION
  finance.transaction:
    merge: APPEND_UNION
    duplicate: RECONCILIATION
  seating.layout:
    merge: VERSIONED_DOCUMENT
    concurrent: MANUAL_CHOOSE_OR_MERGE
  assessment.score:
    merge: SOURCE_OWNER_VERSIONED
    conflict: CORRECTION_WORKFLOW
  report_card:
    merge: NO_AUTO_MERGE_AFTER_LOCK
```

# 108B. APPENDIX K — FRONTEND DESIGN GOVERNANCE

## K.1. Skill provenance

Nguồn upstream cần pin khi môi trường phát triển có network:
- Anthropic Frontend Design: `anthropics/skills`;
- Vercel Web Design Guidelines: `vercel-labs/agent-skills`;
- UI/UX Pro Max: `nextlevelbuilder/ui-ux-pro-max-skill`.

Không lưu credential/token vào skill config.

## K.2. Design decision record

Mỗi redesign lớn SHOULD tạo ADR:
```yaml
design_decision:
  screen: "AttendanceDaily"
  personas: [HOMEROOM_TEACHER]
  primary_device: ANDROID
  density: HIGH
  offline_capable: true
  skill_sources:
    - ui-ux-pro-max
    - anthropic-frontend-design
    - vercel-web-design-guidelines
  accessibility_review: PASSED
  responsive_review: PASSED
```

# 108C. APPENDIX L — EXCEL ROSTER IMPORT ALIAS SEED

Alias tiếng Việt mẫu:
```yaml
student_code: ["mã học sinh", "ma hs", "mã hs", "student id"]
full_name: ["họ và tên", "họ tên", "hoten", "họ tên học sinh"]
date_of_birth: ["ngày sinh", "ngaysinh", "dob"]
gender: ["giới tính", "gioitinh"]
guardian_name: ["phụ huynh", "họ tên phụ huynh", "người giám hộ"]
guardian_phone: ["sđt phụ huynh", "điện thoại phụ huynh", "số điện thoại"]
address: ["địa chỉ", "diachi"]
```

Mapping chỉ là gợi ý; người dùng phải preview trước commit.

# 108D. APPENDIX M — OFFLINE CAPABILITY MATRIX

| Module | Xem offline | Ghi offline | Sync policy |
|---|---:|---:|---|
| Roster | Yes | Limited | field merge |
| Attendance | Yes | Yes | slot conflict review |
| Seating | Yes | Yes | layout version conflict |
| Behavior | Yes | Yes | append union |
| Class Finance | Yes | Yes | append union + reconciliation |
| Gradebook | Yes | Owner only | owner/version conflict |
| Parent contact | Yes, scoped | log yes | field/event merge |
| Counseling sealed case | Default No | Default No | strict online/security |
| Report card signing | Limited | No | online workflow |
| Admin permission config | Cached view optional | No | online only |

# 109. KẾT LUẬN KIẾN TRÚC

Nền tảng hoàn chỉnh không nên được hiểu là “một sổ chủ nhiệm online”. Nó phải là **hệ thống phối hợp giáo dục lấy hồ sơ học sinh làm trung tâm**, trong đó:

- GVCN điều phối lớp và theo dõi sự tiến bộ;
- GVBM cung cấp dữ liệu chuyên môn đúng nguồn;
- phụ huynh được tiếp cận phần dữ liệu của con được phép công bố;
- BGH điều hành bằng workflow và dashboard;
- tư vấn/y tế giữ domain nhạy cảm riêng;
- văn thư quản trị vòng đời hồ sơ;
- học bạ số là record có cấu trúc, ký số và truy vết;
- dữ liệu chỉ nhập một lần;
- quyền luôn gắn phạm vi;
- mọi thay đổi quan trọng có audit;
- retention được quản lý theo policy;
- AI chỉ là trợ lý, không phải người ra quyết định.
- PC và Android đều là client hạng nhất, có thể làm việc offline;
- đồng bộ dựa trên operation/version/merge, không whole-row overwrite;
- sơ đồ lớp, nề nếp, quỹ lớp và Excel import là các công cụ năng suất tích hợp vào đúng domain;
- giao diện mobile-first, tiếng Việt, font ưu tiên Be Vietnam Pro, ngày giờ 24h GMT+7.

Nếu tuân thủ các nguyên tắc và module trong tài liệu này, hệ thống có thể phát triển từ một trường lên nhiều trường mà không phá vỡ mô hình nghiệp vụ, đồng thời đủ khả năng thích ứng với các thay đổi chuẩn dữ liệu và pháp lý sau năm 2026.

---

**END OF MASTER PLAN — Version 1.1 — Baseline 2026-08-26 — Offline-first / Daily Homeroom / UI-UX Extension**
