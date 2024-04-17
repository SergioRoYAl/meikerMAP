
-- Base de datos: `reservarea`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `etiqueta`
--



CREATE DATABASE reservarea ;                                         

CREATE TABLE `etiqueta` (
  `id` bigint(20) NOT NULL,
  `mac` varchar(64) NOT NULL,
  `x` bigint(20) NOT NULL,
  `y` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `isleta`
--

CREATE TABLE `isleta` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(256) NOT NULL,
  `height` bigint(20) NOT NULL,
  `width` bigint(20) NOT NULL,
  `x` bigint(20) NOT NULL,
  `y` bigint(20) NOT NULL,
  `id_zona` bigint(20) NOT NULL,
  `prefijo` varchar(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `isleta`
--

INSERT INTO `isleta` (`id`, `nombre`, `height`, `width`, `x`, `y`, `id_zona`, `prefijo`) VALUES
(398, 'Postres', 100, 100, 170, 553, 4, 'PO'),
(399, 'Postres', 100, 100, 167, 798, 54, 'PO'),
(406, 'Frutas', 100, 100, 170, 553, 66, 'FR'),
(407, 'Pizzas', 100, 100, 170, 553, 67, 'PI'),
(408, 'AA', 100, 100, 0, 36, 69, 'AA'),
(409, 'AA', 100, 100, 0, 146, 69, 'AA'),
(410, 'AA', 100, 100, 0, 256, 69, 'AA'),
(411, 'AA', 100, 100, 0, 383, 69, 'AA'),
(412, 'AA', 100, 100, 0, 493, 69, 'AA'),
(413, 'AA', 100, 100, 0, 36, 70, 'A'),
(414, 'AA', 100, 100, 0, 36, 71, 'AA'),
(415, 'AA', 100, 100, 0, 36, 72, 'AA'),
(416, '', 100, 100, 0, 36, 74, ''),
(417, 'Postres', 100, 100, 0, 38, 76, 'PO'),
(418, 'Helados', 100, 100, 0, 38, 77, 'HE'),
(419, 'Helados', 100, 100, 0, 174, 76, 'HE'),
(420, 'Helados', 100, 100, 0, 148, 77, 'HE'),
(421, 'Gaming', 100, 100, 0, 36, 78, 'GA'),
(422, 'Gambas', 500, 125, 0, 36, 79, 'GA'),
(423, 'Almejas', 100, 100, 0, 400, 79, 'AL'),
(424, 'AA', 165, 242, 0, 38, 82, 'AA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `zona`
--

CREATE TABLE `zona` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(256) NOT NULL,
  `height` bigint(20) NOT NULL,
  `width` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `zona`
--

INSERT INTO `zona` (`id`, `nombre`, `height`, `width`) VALUES
(2, 'Comedor 1', 0, 0),
(3, 'Comedor 1', 0, 0),
(4, 'zona-4', 0, 0),
(5, 'zona-5', 0, 0),
(6, 'zona-6', 0, 0),
(7, 'zona-7', 0, 0),
(8, 'zona-8', 0, 0),
(9, 'zona-9', 0, 0),
(10, 'zona-10', 0, 0),
(11, 'zona-11', 0, 0),
(12, 'zona-12', 0, 0),
(13, 'zona-13', 0, 0),
(14, 'zona-14', 0, 0),
(15, 'zona-15', 0, 0),
(16, 'zona-16', 0, 0),
(17, 'zona-17', 0, 0),
(18, 'zona-18', 0, 0),
(19, 'zona-19', 0, 0),
(20, 'zona-20', 0, 0),
(21, 'zona-21', 0, 0),
(22, 'zona-22', 0, 0),
(23, 'zona-23', 0, 0),
(24, 'zona-24', 0, 0),
(25, 'zona-25', 0, 0),
(26, 'zona-26', 0, 0),
(27, 'zona-27', 0, 0),
(28, 'zona-28', 0, 0),
(29, 'zona-29', 0, 0),
(30, 'zona-30', 0, 0),
(31, 'zona-31', 0, 0),
(32, 'zona-32', 0, 0),
(33, 'zona-33', 0, 0),
(34, 'zona-34', 0, 0),
(35, 'zona-35', 0, 0),
(36, 'zona-36', 0, 0),
(37, 'zona-37', 0, 0),
(38, 'zona-38', 0, 0),
(39, 'zona-39', 0, 0),
(40, 'zona-40', 0, 0),
(41, 'zona-41', 0, 0),
(42, 'zona-42', 0, 0),
(43, 'zona-43', 0, 0),
(44, 'zona-44', 0, 0),
(45, 'zona-45', 0, 0),
(46, 'zona-46', 0, 0),
(47, 'zona-47', 0, 0),
(48, 'zona-48', 0, 0),
(49, 'zona-49', 0, 0),
(50, 'zona-50', 0, 0),
(51, 'zona-51', 0, 0),
(52, 'zona-52', 0, 0),
(53, 'zona-53', 0, 0),
(54, 'zona-54', 0, 0),
(55, 'zona-55', 0, 0),
(56, 'zona-56', 0, 0),
(57, 'zona-57', 0, 0),
(58, 'zona-58', 0, 0),
(59, 'zona-59', 0, 0),
(60, 'zona-60', 0, 0),
(61, 'zona-61', 0, 0),
(62, 'zona-62', 0, 0),
(63, 'zona-63', 0, 0),
(64, 'zona-64', 0, 0),
(65, 'zona-65', 0, 0),
(66, 'zona-66', 0, 0),
(67, 'zona-67', 0, 0),
(68, 'zona-68', 0, 0),
(69, 'zona-69', 0, 0),
(70, 'zona-70', 0, 0),
(71, 'zona-71', 0, 0),
(72, 'zona-72', 0, 0),
(73, 'zona-73', 0, 0),
(74, 'zona-74', 0, 0),
(75, 'zona-75', 0, 0),
(76, 'zona-76', 0, 0),
(77, 'zona-77', 0, 0),
(78, 'zona-78', 0, 0),
(79, 'zona-79', 0, 0),
(80, 'zona-80', 0, 0),
(81, 'zona-81', 0, 0),
(82, 'zona-82', 0, 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `etiqueta`
--
ALTER TABLE `etiqueta`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `isleta`
--
ALTER TABLE `isleta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_isleta_zona` (`id_zona`);

--
-- Indices de la tabla `zona`
--
ALTER TABLE `zona`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `etiqueta`
--
ALTER TABLE `etiqueta`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `isleta`
--
ALTER TABLE `isleta`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=425;

--
-- AUTO_INCREMENT de la tabla `zona`
--
ALTER TABLE `zona`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `isleta`
--
ALTER TABLE `isleta`
  ADD CONSTRAINT `fk_isleta_zona` FOREIGN KEY (`id_zona`) REFERENCES `zona` (`id`) ON DELETE NULL ON UPDATE NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
