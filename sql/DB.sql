-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-04-2024 a las 09:05:42
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `reservarea`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ap`
--

CREATE TABLE `ap` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(256) NOT NULL,
  `x` bigint(20) NOT NULL,
  `y` bigint(20) NOT NULL,
  `id_zona` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `etiqueta`
--

CREATE TABLE `etiqueta` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(256) NOT NULL,
  `mac` varchar(64) NOT NULL,
  `x` bigint(20) NOT NULL,
  `y` bigint(20) NOT NULL,
  `id_isleta` bigint(20) NOT NULL,
  `prefijo` varchar(6) NOT NULL,
  `posicion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `etiqueta`
--

INSERT INTO `etiqueta` (`id`, `nombre`, `mac`, `x`, `y`, `id_isleta`, `prefijo`, `posicion`) VALUES
(78, '', 'cg22asas', 95, 39, 27, 'GAA', 0);

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
  `prefijo` varchar(4) NOT NULL,
  `redonda` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `isleta`
--

INSERT INTO `isleta` (`id`, `nombre`, `height`, `width`, `x`, `y`, `id_zona`, `prefijo`, `redonda`) VALUES
(22, 'Primero', 141, 253, 41, 39, 106, 'PRI', 0),
(23, 'Segundo', 138, 438, 381, 30, 106, 'SEG', 0),
(24, 'Tercero', 243, 645, 3, 248, 106, 'TER', 0),
(26, 'Happy', 141, 253, 103, 92, 107, 'HPY', 0),
(27, 'Happy', 129, 241, 569, 325, 107, 'GAA', 0),
(42, '', 0, 0, 0, 0, 0, '', 1),
(44, 'ewe', 141, 253, 123, 62, 110, 'DSD', 0),
(45, 'ewe', 141, 253, 415, 38, 110, 'QEQ', 0),
(49, 'qqq', 185, 197, 315, 98, 109, 'WWQ', 1),
(50, 'Caliente', 141, 253, 424, 29, 112, 'CAL', 0),
(51, 'Frio', 141, 253, 52, 31, 112, 'FRI', 1),
(54, 'dww', 138, 250, 234, 260, 111, 'WDW', 0),
(55, 'dww', 146, 174, 206, 92, 111, 'GHD', 0),
(57, '', 156, 343, 413, 49, 111, 'BAA', 1),
(58, '', 150, 150, 0, 0, 113, 'WDQ', 1),
(60, 'F3', 97, 97, 114, 80, 115, '311', 0),
(61, 'F3', 127, 251, 587, 148, 115, 'VBA', 0),
(62, '', 150, 150, 0, 0, 0, 'FAA', 1);

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
(115, 'HOLAA', 475, 950);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ap`
--
ALTER TABLE `ap`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ap_a_zona` (`id_zona`);

--
-- Indices de la tabla `etiqueta`
--
ALTER TABLE `etiqueta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_etiqueta_a_zona` (`id_isleta`);

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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

--
-- AUTO_INCREMENT de la tabla `isleta`
--
ALTER TABLE `isleta`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT de la tabla `zona`
--
ALTER TABLE `zona`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=116;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ap`
--
ALTER TABLE `ap`
  ADD CONSTRAINT `fk_ap_a_zona` FOREIGN KEY (`id_zona`) REFERENCES `zona` (`id`);

--
-- Filtros para la tabla `etiqueta`
--
ALTER TABLE `etiqueta`
  ADD CONSTRAINT `fk_etiqueta_a_zona` FOREIGN KEY (`id_isleta`) REFERENCES `isleta` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
